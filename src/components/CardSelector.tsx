"use client";

import { useId, type ReactNode } from "react";

export type CardSelectorOption = {
  value: string;
  label: ReactNode;
};

export type CardSelectorProps = {
  options: CardSelectorOption[];
  columns: number;
  value: string | null;
  onChange: (value: string) => void;
  label?: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export default function CardSelector({
  options,
  columns,
  value,
  onChange,
  label,
  className,
  ariaLabel,
}: CardSelectorProps) {
  const labelId = useId();
  const safeColumns = Math.max(1, Math.floor(columns));

  return (
    <div
      className={["flex w-full flex-col gap-3", className]
        .filter(Boolean)
        .join(" ")}
    >
      {label != null && (
        <h2
          id={labelId}
          className="text-2xl font-bold text-mist-950 dark:text-mist-50"
        >
          {label}
        </h2>
      )}
      <div
        role="radiogroup"
        aria-labelledby={label != null ? labelId : undefined}
        aria-label={label != null ? undefined : ariaLabel}
        className="grid w-full gap-4"
        style={{
          gridTemplateColumns: `repeat(${safeColumns}, minmax(0, 1fr))`,
        }}
      >
        {options.map((option, index) => {
          const selected = value === option.value;
          const inTabOrder = selected || (value === null && index === 0);

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={inTabOrder ? 0 : -1}
              onClick={() => onChange(option.value)}
              className={[
                "w-full rounded-2xl border-2 p-4 text-left font-bold transition-colors",
                selected
                  ? "border-emerald-500 bg-emerald-500 text-black dark:text-black"
                  : "border-neutral-300 bg-transparent text-neutral-900 hover:border-emerald-400 hover:bg-emerald-500/10 dark:border-neutral-600 dark:text-neutral-100 dark:hover:border-emerald-500/80",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
