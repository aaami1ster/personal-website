import type { ContactInput, InquiryType } from "@/components/contact/schema";

// Sends a contact-form submission through the Resend HTTP API (design spec
// §10.2). A plain server-side fetch instead of the SDK keeps the dependency
// list short; server fetches are not subject to the browser CSP. The body is
// plain text, so no HTML escaping is needed. Nothing here logs the message or
// the sender's address.

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = "Abdalla Misbah Website <contact@abdallamisbah.com>";
const DEFAULT_TO = "aaami1ster@gmail.com";
const TIMEOUT_MS = 10_000;

const inquiryLabels: Record<InquiryType, string> = {
  job: "Job opportunity",
  consulting: "Consulting",
  collaboration: "Collaboration",
  other: "Other",
};

/** Removes CR/LF (and other line breaks) so user input cannot add header lines. */
function singleLine(value: string): string {
  return value.replace(/[\r\n\u2028\u2029]+/g, " ").trim();
}

/** Returns true when Resend accepted the email (2xx). */
export async function sendContactEmail(
  input: ContactInput,
  apiKey: string,
): Promise<boolean> {
  const inquiry = inquiryLabels[input.inquiry];
  const subject = singleLine(`[Website] ${inquiry} — ${input.name}`);
  const text = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Inquiry: ${inquiry}`,
    `Organization: ${input.organization || "—"}`,
    "",
    input.message,
  ].join("\n");

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? DEFAULT_FROM,
        to: [process.env.CONTACT_TO_EMAIL ?? DEFAULT_TO],
        reply_to: input.email,
        subject,
        text,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) {
      console.error(`Contact email: Resend responded ${response.status}`);
      return false;
    }
    return true;
  } catch {
    console.error("Contact email: request to Resend failed");
    return false;
  }
}
