/** Tech tag chips: JetBrains Mono 12px, Latin script and LTR in both locales (§4.7). */
export function TagList({ tags, label }: { tags: readonly string[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          dir="ltr"
          className="rounded-lg border bg-surface px-2 py-0.5 font-mono text-xs text-muted"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
