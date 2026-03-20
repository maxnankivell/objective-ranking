"use client";

import type { ReactNode } from "react";

import Button, { type ButtonProps } from "./Button";

export type ToggleOption = {
  value: string;
  label: ReactNode;
};

export type ToggleButtonProps = {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  size?: ButtonProps["size"];
  className?: string;
  "aria-label"?: string;
};

function segmentShapeClass(index: number, total: number): string {
  if (total <= 1) return "!rounded-full";
  if (index === 0) return "!rounded-l-full !rounded-r-none";
  if (index === total - 1) return "!rounded-l-none !rounded-r-full";
  return "!rounded-none";
}

export default function ToggleButton({
  options,
  value,
  onChange,
  size = "medium",
  className,
  "aria-label": ariaLabel,
}: ToggleButtonProps) {
  if (options.length === 0) {
    return null;
  }

  const firstValue = options[0]!.value;
  const activeValue = options.some((o) => o.value === value)
    ? value
    : firstValue;
  const total = options.length;

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={[
        "inline-grid auto-cols-[1fr] grid-rows-1 grid-flow-col justify-start",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {options.map((option, index) => {
        const selected = option.value === activeValue;
        return (
          <Button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            size={size}
            variant={selected ? "contained" : "outlined"}
            fullWidth={true}
            className={[
              "min-w-max! md:min-w-max!",
              segmentShapeClass(index, total),
              selected && "z-10",
              "focus-visible:z-20",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
