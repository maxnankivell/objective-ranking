"use client";

import { useEffect, useRef, useState } from "react";
import { useRankingData } from "../contexts/RankingDataContext";
import type { RankingData } from "../types/RankingData";
import { ALL_TIER_LETTERS } from "../utils/rankingUtilities";

function validateAndParse(raw: unknown): RankingData[] {
  if (!Array.isArray(raw)) {
    throw new Error("JSON must be an array");
  }

  return raw.map((entry, i) => {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
      throw new Error(`Entry at index ${i} is not an object`);
    }

    const obj = entry as Record<string, unknown>;

    if (typeof obj.title !== "string" || obj.title.trim() === "") {
      throw new Error(
        `Entry at index ${i} is missing a valid "title" (string)`,
      );
    }

    const item: RankingData = { title: obj.title.trim() };

    if (obj.image !== undefined) {
      if (typeof obj.image !== "string") {
        throw new Error(`Entry at index ${i}: "image" must be a string`);
      }
      item.image = obj.image;
    }

    if (obj.rank !== undefined) {
      if (typeof obj.rank !== "number") {
        throw new Error(`Entry at index ${i}: "rank" must be a number`);
      }
      item.rank = obj.rank;
    }

    if (obj.unrankedIndex !== undefined) {
      if (typeof obj.unrankedIndex !== "number") {
        throw new Error(
          `Entry at index ${i}: "unrankedIndex" must be a number`,
        );
      }
      item.unrankedIndex = obj.unrankedIndex;
    }

    if (obj.tier !== undefined) {
      if (typeof obj.tier !== "string") {
        throw new Error(`Entry at index ${i}: "tier" must be a string`);
      }
      item.tier = obj.tier;
    }

    return item;
  });
}

function filterDuplicates(
  existing: RankingData[],
  parsed: RankingData[],
): { toAdd: RankingData[]; duplicateCount: number } {
  const seen = new Set(existing.map((i) => i.title));
  const toAdd: RankingData[] = [];
  let duplicateCount = 0;
  for (const item of parsed) {
    if (seen.has(item.title)) {
      duplicateCount++;
      continue;
    }
    seen.add(item.title);
    toAdd.push(item);
  }
  return { toAdd, duplicateCount };
}

export default function JsonUpload() {
  const { items, addItems, activeTierLetters, setActiveTierLetters } =
    useRankingData();

  // FileReader.onload runs later and would close over stale values.
  // Refs always hold the latest values for use inside the callback.
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const activeTierLettersRef = useRef(activeTierLetters);
  useEffect(() => {
    activeTierLettersRef.current = activeTierLetters;
  }, [activeTierLetters]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    added: number;
    duplicates: number;
  } | null>(null);

  function handleFile(file: File) {
    setError(null);
    setSuccess(null);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        const parsedItems = validateAndParse(parsed);
        if (parsedItems.length === 0) {
          setError("JSON array is empty");
          return;
        }
        const { toAdd, duplicateCount } = filterDuplicates(
          itemsRef.current,
          parsedItems,
        );
        if (toAdd.length > 0) {
          addItems(toAdd);

          // Expand active tier letters if the uploaded data references tiers
          // beyond the currently active set. All letters up to and including
          // the highest referenced one are added so the board displays correctly.
          const highestIdx = toAdd.reduce((max, item) => {
            const idx = ALL_TIER_LETTERS.indexOf(item.tier ?? "");
            return idx > max ? idx : max;
          }, -1);

          if (highestIdx >= 0) {
            const needed = ALL_TIER_LETTERS.slice(0, highestIdx + 1);
            const current = activeTierLettersRef.current;
            const merged = ALL_TIER_LETTERS.filter(
              (l) => current.includes(l) || needed.includes(l),
            );
            if (merged.length > current.length) {
              setActiveTierLetters(merged);
            }
          }
        }
        setSuccess({ added: toAdd.length, duplicates: duplicateCount });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Invalid JSON file");
      }
    };
    reader.onerror = () => setError("Failed to read file");
    reader.readAsText(file);
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-bold text-subheading">Add items via JSON</h2>

      <label
        className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 text-sm transition-colors hover:border-emerald-500 dark:hover:border-emerald-500 ${
          isDragOver
            ? "border-emerald-500 dark:border-emerald-500"
            : "border-neutral-400 dark:border-neutral-600"
        }`}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        <span className="pointer-events-none text-subheading">
          Drop a JSON file here or click to browse
        </span>
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {success !== null && (
        <p className="text-sm text-emerald-500">
          {success.added > 0 ? (
            <>
              Successfully added {success.added}{" "}
              {success.added === 1 ? "entry" : "entries"}
              {success.duplicates > 0 ? (
                <>
                  {" "}
                  after removing duplicates. {success.duplicates}{" "}
                  {success.duplicates === 1
                    ? "duplicate was"
                    : "duplicates were"}{" "}
                  ignored.
                </>
              ) : (
                "."
              )}
            </>
          ) : (
            <>
              No new entries were added.
              {success.duplicates > 0 && (
                <>
                  {" "}
                  {success.duplicates}{" "}
                  {success.duplicates === 1
                    ? "duplicate was"
                    : "duplicates were"}{" "}
                  ignored.
                </>
              )}
            </>
          )}
        </p>
      )}
    </div>
  );
}
