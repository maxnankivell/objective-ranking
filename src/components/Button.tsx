import type { ComponentProps } from "react";

type ButtonSize = "small" | "medium" | "large";
type ButtonVariant = "contained" | "outlined";

const sizeClasses: Record<ButtonSize, string> = {
  small: "h-3 px-5 text-sm",
  medium: "py-4 px-8 text-base",
  large: "h-6 px-12 text-lg",
};

const variantClasses: Record<ButtonVariant, string> = {
  contained:
    "border-2 border-transparent bg-emerald-500 text-black hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:hover:bg-emerald-500/50",
  outlined:
    "border-2 border-emerald-500 bg-transparent text-emerald-700 hover:bg-emerald-500/10 disabled:border-emerald-500/40 disabled:text-emerald-700/50 disabled:hover:bg-transparent",
};

export type ButtonProps = ComponentProps<"button"> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

export default function Button({
  size = "medium",
  variant = "contained",
  fullWidth = false,
  className,
  type,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      className={[
        "flex cursor-pointer items-center justify-center gap-2 rounded-full font-bold transition-colors disabled:cursor-not-allowed",
        fullWidth ? "w-full max-w-none" : "max-w-40",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
