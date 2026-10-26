import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type IconButtonProps = ComponentProps<"button"> & { label: string };

export function IconButton({
  label,
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-fg",
        className,
      )}
      {...props}
    />
  );
}
