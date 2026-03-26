import Link from "next/link";
import type { ComponentProps } from "react";

import {
  buttonSizeClasses,
  buttonVariantClasses,
  type ButtonSize,
  type ButtonVariant,
} from "./Button";

export type ButtonLinkProps = ComponentProps<typeof Link> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  error?: boolean;
  disabled?: boolean;
};

export default function ButtonLink({
  size = "medium",
  variant = "contained",
  fullWidth = false,
  error = false,
  disabled = false,
  className,
  href,
  prefetch,
  onClick,
  tabIndex,
  "aria-disabled": ariaDisabled,
  ...props
}: ButtonLinkProps) {
  const tone = error ? "error" : "default";
  return (
    <Link
      {...props}
      href={disabled ? "#" : href}
      prefetch={disabled ? false : prefetch}
      aria-disabled={disabled ? true : ariaDisabled}
      tabIndex={disabled ? -1 : tabIndex}
      onClick={(e) => {
        if (disabled) e.preventDefault();
        onClick?.(e);
      }}
      className={[
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-bold transition-colors",
        fullWidth ? "w-full max-w-none" : "",
        buttonVariantClasses[variant][tone],
        buttonSizeClasses[size],
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
