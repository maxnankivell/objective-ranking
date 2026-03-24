"use client";

import { useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { useRankingData } from "../contexts/RankingDataContext";
import { parseRankingFormatParam } from "../utils/queryStringUtilities";
import {
  buildOrderedExportLines,
  buildTierExportLines,
  type TierGroups,
} from "../utils/rankingUtilities";
import Button from "./Button";

function downloadBlob(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export type RankingExportControlsProps = {
  tierGroups?: TierGroups;
  activeTiers?: string[];
};

export default function RankingExportControls({
  tierGroups,
  activeTiers,
}: RankingExportControlsProps) {
  const { items } = useRankingData();
  const searchParams = useSearchParams();
  const rankingFormat = parseRankingFormatParam(searchParams.get("format"));
  const [exportKind, setExportKind] = useState<"text" | "json">("text");
  const selectId = useId();

  const handleDownload = () => {
    if (exportKind === "json") {
      downloadBlob(
        "ranking.json",
        JSON.stringify(items, null, 2),
        "application/json",
      );
      return;
    }

    const lines =
      rankingFormat === "tierlist" && tierGroups && activeTiers
        ? buildTierExportLines(tierGroups, activeTiers)
        : buildOrderedExportLines(items);
    const body = lines.join("\n");
    downloadBlob("ranking.txt", body, "text/plain;charset=utf-8");
  };

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      <label
        htmlFor={selectId}
        className="text-sm font-bold text-body whitespace-nowrap"
      >
        Download As
      </label>
      <select
        id={selectId}
        value={exportKind}
        onChange={(e) => setExportKind(e.target.value as "text" | "json")}
        className="rounded-lg border-2 border-neutral-300 pl-1.5 pr-4 py-1.5 text-sm text-body outline-none transition-colors focus:border-emerald-500 dark:border-neutral-700 dark:bg-mist-900 dark:scheme-dark dark:focus:border-emerald-500"
      >
        <option className="dark:bg-mist-900" value="text">
          text
        </option>
        <option className="dark:bg-mist-900" value="json">
          json
        </option>
      </select>
      <Button
        type="button"
        variant="outlined"
        size="small"
        onClick={handleDownload}
        className="max-w-none shrink-0"
      >
        Download
      </Button>
    </div>
  );
}
