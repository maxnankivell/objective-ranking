"use client";

import { useEffect, useRef, useState } from "react";
import { useRankingData } from "../contexts/RankingDataContext";
import type { RankingData } from "../types/RankingData";

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
  const { items, addItems } = useRankingData();

  // FileReader.onload runs later; it would close over a stale `items` from when
  // the file was chosen. The ref always holds the latest list for deduping.
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

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
