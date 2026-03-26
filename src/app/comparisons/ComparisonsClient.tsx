"use client";

import { Press_Start_2P } from "next/font/google";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import ButtonLink from "../../components/ButtonLink";
import { useRankingData } from "../../contexts/RankingDataContext";
import type { RankingData } from "../../types/RankingData";
import {
  advanceSortState,
  assignTiers,
  initSortState,
  type SortState,
} from "../../utils/comparisonSortUtilities";
import { parseRankingFormatParam } from "../../utils/queryStringUtilities";
import { ALL_TIER_LETTERS } from "../../utils/rankingUtilities";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

export default function ComparisonsClient() {
  const { items, updateRanks, updateTiers } = useRankingData();

  const searchParams = useSearchParams();
  const format = parseRankingFormatParam(searchParams.get("format"));

  const [sortState, setSortState] = useState<SortState | null>(null);
  const ranksUpdatedRef = useRef(false);

  useEffect(() => {
    if (items.length > 0 && sortState === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSortState(initSortState(items));
    }
  }, [items, sortState]);

  useEffect(() => {
    if (!sortState?.isDone || ranksUpdatedRef.current) return;
    const sortedGroups = sortState.completedGroups[0];
    if (!sortedGroups) return;
    ranksUpdatedRef.current = true;

    if (format === "tierlist") {
      updateTiers(assignTiers(sortedGroups, ALL_TIER_LETTERS));
    } else {
      updateRanks(
        sortedGroups.flatMap((group, i) =>
          group.map((item) => ({ title: item.title, rank: i + 1 })),
        ),
      );
    }
  }, [sortState, format, updateRanks, updateTiers]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-6">
        <p className="text-lg text-subheading">
          No items yet. Add some data first.
        </p>
        <ButtonLink href="/add-data">Add Data</ButtonLink>
      </div>
    );
  }

  if (sortState === null) {
    return null;
  }

  if (sortState.isDone) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-10">
        <h1
          className={`${pressStart2P.className} text-xl sm:text-2xl text-center text-heading leading-loose`}
        >
          Sorting Complete!
        </h1>
        <ButtonLink href={`/ranking?format=${format}`} size="large">
          View Your Results
        </ButtonLink>
      </div>
    );
  }

  const { currentJob } = sortState;
  if (!currentJob) return null;

  const leftItem = currentJob.left[currentJob.leftPtr][0];
  const rightItem = currentJob.right[currentJob.rightPtr][0];

  function handleChoice(choice: "left" | "right" | "same") {
    setSortState((prev) => {
      if (!prev?.currentJob) return prev;
      return advanceSortState(prev, choice);
    });
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <div className="flex items-center gap-6 sm:gap-12 lg:gap-20">
        <ComparisonCard item={leftItem} onClick={() => handleChoice("left")} />
        <div className="flex flex-col items-center gap-4 shrink-0">
          <span
            className={`${pressStart2P.className} text-2xl sm:text-4xl md:text-5xl lg:text-7xl text-heading select-none`}
          >
            VS
          </span>
          {format === "tierlist" && (
            <Button
              variant="outlined"
              size="medium"
              onClick={() => handleChoice("same")}
            >
              Same Tier
            </Button>
          )}
        </div>
        <ComparisonCard
          item={rightItem}
          onClick={() => handleChoice("right")}
        />
      </div>
    </div>
  );
}

function ComparisonCard({
  item,
  onClick,
}: {
  item: RankingData;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-4 cursor-pointer group focus:outline-none"
    >
      <div className="relative w-30 h-42 sm:w-45 sm:h-64 md:w-56 md:h-80 lg:w-68 lg:h-96 rounded-2xl overflow-hidden ring-4 ring-transparent transition-all duration-200 group-hover:ring-emerald-500 group-hover:scale-105 group-focus-visible:ring-emerald-500 group-focus-visible:scale-105 shadow-lg">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-200 p-4 dark:bg-neutral-800">
            <span className="text-center text-sm font-bold text-body line-clamp-6">
              {item.title}
            </span>
          </div>
        )}
      </div>
      <span className="max-w-36 sm:max-w-52 lg:max-w-64 text-center text-sm font-bold text-heading line-clamp-3">
        {item.title}
      </span>
    </button>
  );
}
