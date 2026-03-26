import type { ComponentProps } from "react";

export type ButtonSize = "small" | "medium" | "large";
export type ButtonVariant = "contained" | "outlined";

export const buttonSizeClasses: Record<ButtonSize, string> = {
  small: "py-1 px-5 text-sm",
  medium: "py-3 px-8 text-base",
  large: "py-5 px-12 text-lg",
};

export const buttonVariantClasses: Record<
  ButtonVariant,
  { default: string; error: string }
> = {
  contained: {
    default:
      "border-2 border-transparent bg-emerald-500 text-black hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:hover:bg-emerald-500/50",
    error:
      "border-2 border-transparent bg-red-500 text-black hover:bg-red-600 disabled:bg-red-500/50 disabled:hover:bg-red-500/50",
  },
  outlined: {
    default:
      "border-2 border-emerald-500 bg-transparent text-black hover:bg-emerald-500/10 dark:text-white disabled:border-emerald-500/40 disabled:text-black/50 dark:disabled:text-white/50 disabled:hover:bg-transparent",
    error:
      "border-2 border-red-500 bg-transparent text-black hover:bg-red-500/10 dark:text-white disabled:border-red-500/40 disabled:text-black/50 dark:disabled:text-white/50 disabled:hover:bg-transparent",
  },
};

export type ButtonProps = ComponentProps<"button"> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  error?: boolean;
};

export default function Button({
  size = "medium",
  variant = "contained",
  fullWidth = false,
  error = false,
  className,
  type,
  ...props
}: ButtonProps) {
  const tone = error ? "error" : "default";
  return (
    <button
      type={type ?? "button"}
      className={[
        "flex cursor-pointer items-center justify-center gap-2 rounded-full font-bold transition-colors disabled:cursor-not-allowed",
        fullWidth ? "w-full max-w-none" : "",
        buttonVariantClasses[variant][tone],
        buttonSizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
