"use client";

import { LoaderCircle } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  contactErrorKeys,
  contactFields,
  contactSchema,
  inquiryTypes,
  type ContactErrorKey,
  type ContactField,
  type InquiryType,
} from "./schema";

export type ContactFormLabels = {
  fields: {
    name: string;
    email: string;
    inquiry: string;
    inquiryPlaceholder: string;
    organization: string;
    message: string;
    website: string;
  };
  inquiry: Record<InquiryType, string>;
  consent: ReactNode;
  submit: string;
  submitting: string;
  errorSummary: string;
  errors: Record<ContactErrorKey, string>;
  success: string;
  unavailable: string;
  openEmail: string;
  rateLimited: string;
  failed: string;
};

type Values = {
  name: string;
  email: string;
  inquiry: string;
  organization: string;
  message: string;
  consent: boolean;
};

type Status = "idle" | "submitting" | "success" | "unavailable" | "rate_limited" | "failed";
type Errors = Partial<Record<ContactField, ContactErrorKey>>;

const initialValues: Values = {
  name: "",
  email: "",
  inquiry: "",
  organization: "",
  message: "",
  consent: false,
};

const MAILTO_BODY_MAX = 1800;

const fieldId = (field: ContactField) => `contact-${field}`;
const errorId = (field: ContactField) => `contact-${field}-error`;

const control = cn(
  "mt-2 block w-full rounded-lg border bg-surface px-3 text-fg",
  "aria-[invalid=true]:border-danger",
);
const labelClass = "block text-sm font-medium";
const errorClass = "mt-2 text-sm text-danger";
const link = "text-accent underline underline-offset-4";

function isErrorKey(value: string): value is ContactErrorKey {
  return (contactErrorKeys as readonly string[]).includes(value);
}

// Contact form (design spec §10.1). A native form with client-side Zod
// validation; the same schema runs again in POST /api/contact. Strings arrive
// as props because the layout serializes no message catalog.
export function ContactForm({ labels }: { labels: ContactFormLabels }) {
  const [values, setValues] = useState<Values>(initialValues);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const startedAt = useRef<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Set after mount, never at render: the page is prerendered at build time.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Move focus to the outcome so keyboard and screen-reader users land on it.
  useEffect(() => {
    if (status !== "idle" && status !== "submitting") resultRef.current?.focus();
  }, [status]);

  const submitting = status === "submitting";

  function update(field: Exclude<ContactField, "consent">) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [field]: event.target.value }));
  }

  function focusField(field: ContactField) {
    document.getElementById(fieldId(field))?.focus();
  }

  function onSummaryLink(field: ContactField) {
    return (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      focusField(field);
    };
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const result = contactSchema.safeParse(values);
    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as ContactField;
        if (next[field] === undefined && isErrorKey(issue.message)) {
          next[field] = issue.message;
        }
      }
      setErrors(next);
      setAttempt((n) => n + 1);
      setStatus("idle");
      const first = contactFields.find((field) => next[field] !== undefined);
      if (first) focusField(first);
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.data,
          website,
          startedAt: startedAt.current ?? Date.now(),
        }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok: boolean; error?: string }
        | null;
      if (data?.ok) {
        setValues(initialValues);
        setWebsite("");
        startedAt.current = Date.now();
        setStatus("success");
      } else if (data?.error === "unavailable") {
        setStatus("unavailable");
      } else if (data?.error === "rate_limited") {
        setStatus("rate_limited");
      } else {
        setStatus("failed");
      }
    } catch {
      setStatus("failed");
    }
  }

  const mailto = buildMailto(values, labels);
  const errorFields = contactFields.filter((field) => errors[field] !== undefined);

  const fieldProps = (field: ContactField) => ({
    id: fieldId(field),
    name: field,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? errorId(field) : undefined,
  });

  const fieldError = (field: ContactField) => {
    const key = errors[field];
    return key ? (
      <p id={errorId(field)} className={errorClass}>
        {labels.errors[key]}
      </p>
    ) : null;
  };

  const outcome =
    status === "success" ? (
      <div
        ref={resultRef}
        role="status"
        tabIndex={-1}
        className="rounded-lg border border-success bg-surface p-4 outline-none"
      >
        {labels.success}
      </div>
    ) : status === "unavailable" || status === "rate_limited" || status === "failed" ? (
      <div
        ref={resultRef}
        role="alert"
        tabIndex={-1}
        className="rounded-lg border border-danger bg-surface p-4 outline-none"
      >
        <p>
          {status === "unavailable"
            ? labels.unavailable
            : status === "rate_limited"
              ? labels.rateLimited
              : labels.failed}
        </p>
        <p className="mt-3">
          <a href={mailto} className={cn(link, "font-medium")}>
            {labels.openEmail}
          </a>
        </p>
      </div>
    ) : null;

  return (
    <form noValidate method="post" onSubmit={onSubmit} className="grid gap-6">
      {outcome}

      {errorFields.length > 0 && (
        <div
          key={attempt}
          role="alert"
          className="rounded-lg border border-danger bg-surface p-4"
        >
          <p className="font-medium">{labels.errorSummary}</p>
          <ul className="mt-2 list-disc ps-5 text-sm">
            {errorFields.map((field) => (
              <li key={field}>
                <a href={`#${fieldId(field)}`} onClick={onSummaryLink(field)} className={link}>
                  {labels.errors[errors[field]!]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId("name")} className={labelClass}>
            {labels.fields.name}
          </label>
          <input
            {...fieldProps("name")}
            type="text"
            autoComplete="name"
            required
            value={values.name}
            onChange={update("name")}
            className={cn(control, "h-11")}
          />
          {fieldError("name")}
        </div>

        <div>
          <label htmlFor={fieldId("email")} className={labelClass}>
            {labels.fields.email}
          </label>
          <input
            {...fieldProps("email")}
            type="email"
            autoComplete="email"
            required
            dir="ltr"
            value={values.email}
            onChange={update("email")}
            className={cn(control, "h-11 text-start")}
          />
          {fieldError("email")}
        </div>

        <div>
          <label htmlFor={fieldId("inquiry")} className={labelClass}>
            {labels.fields.inquiry}
          </label>
          <select
            {...fieldProps("inquiry")}
            required
            value={values.inquiry}
            onChange={update("inquiry")}
            className={cn(control, "h-11")}
          >
            <option value="">{labels.fields.inquiryPlaceholder}</option>
            {inquiryTypes.map((type) => (
              <option key={type} value={type}>
                {labels.inquiry[type]}
              </option>
            ))}
          </select>
          {fieldError("inquiry")}
        </div>

        <div>
          <label htmlFor={fieldId("organization")} className={labelClass}>
            {labels.fields.organization}
          </label>
          <input
            {...fieldProps("organization")}
            type="text"
            autoComplete="organization"
            value={values.organization}
            onChange={update("organization")}
            className={cn(control, "h-11")}
          />
          {fieldError("organization")}
        </div>
      </div>

      <div>
        <label htmlFor={fieldId("message")} className={labelClass}>
          {labels.fields.message}
        </label>
        <textarea
          {...fieldProps("message")}
          required
          rows={8}
          value={values.message}
          onChange={update("message")}
          className={cn(control, "min-h-40 py-2")}
        />
        {fieldError("message")}
      </div>

      {/* Honeypot: hidden from sighted users and assistive tech; bots that
          fill it get a silent success from the route. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="contact-website">{labels.fields.website}</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            {...fieldProps("consent")}
            type="checkbox"
            required
            checked={values.consent}
            onChange={(event) =>
              setValues((v) => ({ ...v, consent: event.target.checked }))
            }
            className="mt-1 size-4 shrink-0 accent-accent"
          />
          <label htmlFor={fieldId("consent")} className="text-sm">
            {labels.consent}
          </label>
        </div>
        {fieldError("consent")}
      </div>

      <div>
        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting || undefined}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-cta px-5 font-medium text-white transition-colors hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {submitting && (
            <LoaderCircle aria-hidden="true" className="size-4 motion-safe:animate-spin" />
          )}
          {submitting ? labels.submitting : labels.submit}
        </button>
      </div>
    </form>
  );
}

/** mailto: link to Abdalla, prefilled with what the visitor typed. */
function buildMailto(values: Values, labels: ContactFormLabels): string {
  const inquiry = (inquiryTypes as readonly string[]).includes(values.inquiry)
    ? labels.inquiry[values.inquiry as InquiryType]
    : "";
  const name = values.name.trim();
  const subject = ["[Website]", [inquiry, name].filter(Boolean).join(" — ")]
    .filter(Boolean)
    .join(" ");

  const lines = [
    name && `${labels.fields.name}: ${name}`,
    values.organization.trim() &&
      `${labels.fields.organization}: ${values.organization.trim()}`,
  ].filter(Boolean);
  let body = [...lines, lines.length ? "" : null, values.message.trim()]
    .filter((line) => line !== null)
    .join("\n");
  const chars = Array.from(body);
  if (chars.length > MAILTO_BODY_MAX) body = `${chars.slice(0, MAILTO_BODY_MAX).join("")}…`;

  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
