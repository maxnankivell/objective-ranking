"use client";

import { useId, type ReactNode } from "react";

export type CardSelectorOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

const BASE_GRID_COLS = [
  "",
  "grid-cols-1",
  "grid-cols-2",
  "grid-cols-3",
  "grid-cols-4",
  "grid-cols-5",
  "grid-cols-6",
  "grid-cols-7",
  "grid-cols-8",
  "grid-cols-9",
  "grid-cols-10",
  "grid-cols-11",
  "grid-cols-12",
] as const;

const SM_GRID_COLS = [
  "",
  "sm:grid-cols-1",
  "sm:grid-cols-2",
  "sm:grid-cols-3",
  "sm:grid-cols-4",
  "sm:grid-cols-5",
  "sm:grid-cols-6",
  "sm:grid-cols-7",
  "sm:grid-cols-8",
  "sm:grid-cols-9",
  "sm:grid-cols-10",
  "sm:grid-cols-11",
  "sm:grid-cols-12",
] as const;

const MD_GRID_COLS = [
  "",
  "md:grid-cols-1",
  "md:grid-cols-2",
  "md:grid-cols-3",
  "md:grid-cols-4",
  "md:grid-cols-5",
  "md:grid-cols-6",
  "md:grid-cols-7",
  "md:grid-cols-8",
  "md:grid-cols-9",
  "md:grid-cols-10",
  "md:grid-cols-11",
  "md:grid-cols-12",
] as const;

const LG_GRID_COLS = [
  "",
  "lg:grid-cols-1",
  "lg:grid-cols-2",
  "lg:grid-cols-3",
  "lg:grid-cols-4",
  "lg:grid-cols-5",
  "lg:grid-cols-6",
  "lg:grid-cols-7",
  "lg:grid-cols-8",
  "lg:grid-cols-9",
  "lg:grid-cols-10",
  "lg:grid-cols-11",
  "lg:grid-cols-12",
] as const;

function clampGridIndex(n: number): number {
  return Math.min(12, Math.max(1, Math.floor(n)));
}

export type CardSelectorProps = {
  options: CardSelectorOption[];
  columnsBelowSm: number;
  columnsSm: number;
  columnsMd: number;
  columnsLg: number;
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export default function CardSelector({
  options,
  columnsBelowSm,
  columnsSm,
  columnsMd,
  columnsLg,
  value,
  onChange,
  disabled: groupDisabled = false,
  label,
  className,
  ariaLabel,
}: CardSelectorProps) {
  const labelId = useId();
  const baseIdx = clampGridIndex(columnsBelowSm);
  const smIdx = clampGridIndex(columnsSm);
  const mdIdx = clampGridIndex(columnsMd);
  const lgIdx = clampGridIndex(columnsLg);

  const isRowDisabled = (option: CardSelectorOption) =>
    groupDisabled || !!option.disabled;

  return (
    <div
      className={["flex w-full flex-col gap-3", className]
        .filter(Boolean)
        .join(" ")}
    >
      {label != null && (
        <h2 id={labelId} className="text-2xl font-bold text-subheading">
          {label}
        </h2>
      )}
      <div
        role="radiogroup"
        aria-disabled={groupDisabled || undefined}
        aria-labelledby={label != null ? labelId : undefined}
        aria-label={label != null ? undefined : ariaLabel}
        className={[
          "grid w-full gap-4",
          BASE_GRID_COLS[baseIdx],
          SM_GRID_COLS[smIdx],
          MD_GRID_COLS[mdIdx],
          LG_GRID_COLS[lgIdx],
        ].join(" ")}
      >
        {options.map((option) => {
          const rowDisabled = isRowDisabled(option);
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={rowDisabled}
              onClick={() => onChange(option.value)}
              className={[
                "w-full rounded-2xl border-2 p-4 text-left font-bold transition-colors",
                "disabled:cursor-not-allowed disabled:opacity-50",
                selected
                  ? "border-emerald-500 bg-emerald-500 text-black dark:text-black disabled:border-emerald-500/60 disabled:bg-emerald-500/50"
                  : "border-mist-300 bg-transparent text-mist-950 enabled:hover:border-emerald-400 enabled:hover:bg-emerald-500/10 dark:border-mist-600 dark:text-mist-50 dark:enabled:hover:border-emerald-500/80",
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
