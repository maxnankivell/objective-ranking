"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { dataMethods } from "../constants/dataMethods";

function isMethodDisabled(method: (typeof dataMethods)[number]): boolean {
  return method.disabled === true || method.label.includes("(Coming soon)");
}

export default function AddDataMethodTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const enabledMethods = dataMethods.filter(
    (method) => !isMethodDisabled(method),
  );
  const enabledMethodValues = enabledMethods.map((method) => method.value);
  const defaultMethod = enabledMethodValues[0] ?? "";
  const queryMethod = searchParams.get("method");
  const selectedMethod = enabledMethodValues.includes(queryMethod ?? "")
    ? (queryMethod as string)
    : defaultMethod;

  const selectedMethodLabel =
    dataMethods.find((method) => method.value === selectedMethod)?.label ??
    "Add Data";

  return (
    <section className="flex w-full flex-col gap-6">
      <div
        role="tablist"
        aria-label="Add data method tabs"
        className="flex flex-wrap border-b border-neutral-300 dark:border-neutral-700"
      >
        {dataMethods.map((method) => {
          const selected = method.value === selectedMethod;
          const disabled = isMethodDisabled(method);
          return (
            <button
              key={method.value}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-disabled={disabled}
              disabled={disabled}
              className={[
                "px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors",
                selected
                  ? "border-emerald-500 text-heading"
                  : "border-transparent text-subheading",
                disabled
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:text-heading hover:border-neutral-400 dark:hover:border-neutral-500",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                if (disabled) return;
                const nextParams = new URLSearchParams(searchParams.toString());
                nextParams.set("method", method.value);
                router.replace(`${pathname}?${nextParams.toString()}`);
              }}
            >
              {method.label}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-4">
        {/* <h2 className="text-2xl font-bold text-heading">
          {selectedMethodLabel}
        </h2> */}
        <p className="text-subheading">text about backloggd</p>
        <p className="text-body">upload</p>
        <p className="text-body">manual add</p>
      </div>
    </section>
  );
}
