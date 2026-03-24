"use client";

import { CollisionPriority } from "@dnd-kit/abstract";
import { move } from "@dnd-kit/helpers";
import { DragDropProvider, useDroppable } from "@dnd-kit/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRankingData } from "../contexts/RankingDataContext";
import { parseRankingFormatParam } from "../utils/queryStringUtilities";
import {
  ALL_TIER_LETTERS,
  MAX_TIERS,
  deriveGroups,
  deriveTierGroups,
  type Groups,
  type TierGroups,
} from "../utils/rankingUtilities";
import ButtonLink from "./ButtonLink";
import { buttonSizeClasses, buttonVariantClasses } from "./buttonStyles";
import RankingExportControls from "./RankingExportControls";
import SortableItemTile from "./SortableItemTile";

type RankingBoardProps = {
  className?: string;
};

export default function RankingBoard({ className }: RankingBoardProps) {
  const { items } = useRankingData();
  const searchParams = useSearchParams();
  const format = parseRankingFormatParam(searchParams.get("format"));

  if (items.length === 0) {
    return (
      <p className="text-lg text-subheading">
        No items yet. Add some data first.
      </p>
    );
  }

  return (
    <div
      className={["flex w-full flex-col gap-8", className]
        .filter(Boolean)
        .join(" ")}
    >
      {format === "tierlist" ? <TierListBoard /> : <OrderedBoard />}
    </div>
  );
}

function OrderedBoard() {
  const { items, updateRanks } = useRankingData();

  const [groups, setGroups] = useState<Groups>(() => deriveGroups(items));
  const groupsRef = useRef(groups);
  const previousGroups = useRef(groups);
  const [prevItems, setPrevItems] = useState(items);

  if (items !== prevItems) {
    setPrevItems(items);
    const prevTitles = new Set(prevItems.map((i) => i.title));
    const titlesChanged =
      items.length !== prevItems.length ||
      items.some((i) => !prevTitles.has(i.title));
    if (titlesChanged) {
      setGroups(deriveGroups(items));
    }
  }

  useEffect(() => {
    groupsRef.current = groups;
  }, [groups]);

  const persistRanks = (newGroups: Groups) => {
    const updates: { title: string; rank?: number; unrankedIndex?: number }[] =
      [];
    newGroups.ranked.forEach((title, i) =>
      updates.push({ title, rank: i + 1, unrankedIndex: undefined }),
    );
    newGroups.unranked.forEach((title, i) =>
      updates.push({ title, rank: undefined, unrankedIndex: i }),
    );
    updateRanks(updates);
  };

  return (
    <DragDropProvider
      onDragStart={() => {
        previousGroups.current = groupsRef.current;
      }}
      onDragOver={(event) => {
        setGroups((current) => {
          const next = move(current, event);
          groupsRef.current = next;
          return next;
        });
      }}
      onDragEnd={(event) => {
        if (event.canceled) {
          groupsRef.current = previousGroups.current;
          setGroups(previousGroups.current);
          return;
        }
        persistRanks(groupsRef.current);
      }}
    >
      <OrderedRankedZone>
        {groups.ranked.map((title, index) => {
          const item = items.find((i) => i.title === title);
          return (
            <SortableItemTile
              key={title}
              id={title}
              index={index}
              group="ranked"
              title={title}
              image={item?.image}
              rank={index + 1}
            />
          );
        })}
      </OrderedRankedZone>

      <UnrankedZone>
        {groups.unranked.map((title, index) => {
          const item = items.find((i) => i.title === title);
          return (
            <SortableItemTile
              key={title}
              id={title}
              index={index}
              group="unranked"
              title={title}
              image={item?.image}
            />
          );
        })}
      </UnrankedZone>
    </DragDropProvider>
  );
}

function TierListBoard() {
  const { items, updateTiers, activeTierLetters, setActiveTierLetters } =
    useRankingData();

  const [tierGroups, setTierGroups] = useState<TierGroups>(() =>
    deriveTierGroups(items, activeTierLetters),
  );
  const tierGroupsRef = useRef(tierGroups);
  const previousTierGroups = useRef(tierGroups);
  const [prevItems, setPrevItems] = useState(items);
  const [prevActiveTiers, setPrevActiveTiers] = useState(activeTierLetters);

  if (items !== prevItems || activeTierLetters !== prevActiveTiers) {
    setPrevItems(items);
    setPrevActiveTiers(activeTierLetters);
    const prevTitles = new Set(prevItems.map((i) => i.title));
    const titlesChanged =
      items.length !== prevItems.length ||
      items.some((i) => !prevTitles.has(i.title));
    if (titlesChanged || activeTierLetters !== prevActiveTiers) {
      setTierGroups(deriveTierGroups(items, activeTierLetters));
    }
  }

  useEffect(() => {
    tierGroupsRef.current = tierGroups;
  }, [tierGroups]);

  const persistTiers = (newGroups: TierGroups) => {
    const updates: { title: string; tier?: string }[] = [
      ...activeTierLetters.flatMap((t) =>
        (newGroups[t] ?? []).map((title) => ({ title, tier: t })),
      ),
      ...(newGroups.unranked ?? []).map((title) => ({
        title,
        tier: undefined,
      })),
    ];
    updateTiers(updates);
  };

  const nextTierLetter = ALL_TIER_LETTERS.find(
    (l) => !activeTierLetters.includes(l) && l !== "S",
  );
  const canAddTier = activeTierLetters.length < MAX_TIERS;
  const canRemoveTier = activeTierLetters.length > 1;

  const handleAddTier = () => {
    if (!canAddTier || !nextTierLetter) return;
    const next = [...activeTierLetters, nextTierLetter];
    setActiveTierLetters(next);
    setTierGroups((prev) => ({ ...prev, [nextTierLetter]: [] }));
  };

  const handleRemoveBottomTier = () => {
    if (!canRemoveTier) return;
    const bottom = activeTierLetters.at(-1);
    if (!bottom) return;
    const titlesFromBottom = tierGroups[bottom] ?? [];
    setActiveTierLetters(activeTierLetters.slice(0, -1));
    setTierGroups((prev) => {
      const next = { ...prev };
      delete next[bottom];
      next.unranked = [...(prev.unranked ?? []), ...titlesFromBottom];
      return next;
    });
    if (titlesFromBottom.length > 0) {
      updateTiers(
        titlesFromBottom.map((title) => ({ title, tier: undefined })),
      );
    }
  };

  return (
    <DragDropProvider
      onDragStart={() => {
        previousTierGroups.current = tierGroupsRef.current;
      }}
      onDragOver={(event) => {
        setTierGroups((current) => {
          const next = move(current, event);
          tierGroupsRef.current = next;
          return next;
        });
      }}
      onDragEnd={(event) => {
        if (event.canceled) {
          tierGroupsRef.current = previousTierGroups.current;
          setTierGroups(previousTierGroups.current);
          return;
        }
        persistTiers(tierGroupsRef.current);
      }}
    >
      <TierListRankedZone
        tierGroups={tierGroups}
        activeTiers={activeTierLetters}
        items={items}
        canAddTier={canAddTier}
        onAddTier={handleAddTier}
        canRemoveTier={canRemoveTier}
        onRemoveBottomTier={handleRemoveBottomTier}
      />

      <UnrankedZone>
        {(tierGroups.unranked ?? []).map((title, index) => {
          const item = items.find((i) => i.title === title);
          return (
            <SortableItemTile
              key={title}
              id={title}
              index={index}
              group="unranked"
              title={title}
              image={item?.image}
            />
          );
        })}
      </UnrankedZone>
    </DragDropProvider>
  );
}

function OrderedRankedZone({ children }: { children: React.ReactNode }) {
  const { ref, isDropTarget } = useDroppable({
    id: "ranked",
    type: "column",
    accept: "item",
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <section className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-subheading">Ranked</h2>
        <RankingExportControls />
      </div>
      <div
        ref={ref}
        className={[
          "grid w-full min-h-40 grid-cols-[repeat(auto-fill,minmax(6rem,max-content))] place-content-center justify-items-center gap-3 rounded-lg p-4 transition-colors",
          isDropTarget
            ? "bg-emerald-100 dark:bg-emerald-950"
            : "bg-mist-100 dark:bg-mist-950",
        ].join(" ")}
      >
        {children}
        {!children || (Array.isArray(children) && children.length === 0) ? (
          <p className="col-span-full m-auto text-sm text-neutral-500 dark:text-neutral-400">
            Drag items here to rank them
          </p>
        ) : null}
      </div>
    </section>
  );
}

const TIER_COLORS: Record<string, string> = {
  S: "bg-red-400 dark:bg-red-600",
  A: "bg-orange-400 dark:bg-orange-600",
  B: "bg-yellow-400 dark:bg-yellow-600",
  C: "bg-green-400 dark:bg-green-600",
  D: "bg-teal-400 dark:bg-teal-600",
  E: "bg-cyan-400 dark:bg-cyan-600",
  F: "bg-blue-400 dark:bg-blue-600",
  G: "bg-indigo-400 dark:bg-indigo-600",
  H: "bg-violet-400 dark:bg-violet-600",
  I: "bg-purple-400 dark:bg-purple-600",
};

type TierListRankedZoneProps = {
  tierGroups: TierGroups;
  activeTiers: string[];
  items: { title: string; image?: string }[];
  canAddTier: boolean;
  onAddTier: () => void;
  canRemoveTier: boolean;
  onRemoveBottomTier: () => void;
};

function TierListRankedZone({
  tierGroups,
  activeTiers,
  items,
  canAddTier,
  onAddTier,
  canRemoveTier,
  onRemoveBottomTier,
}: TierListRankedZoneProps) {
  return (
    <section className="flex w-full flex-col gap-2">
      <div className="flex w-full flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-subheading">Tier List</h2>
        <RankingExportControls
          tierGroups={tierGroups}
          activeTiers={activeTiers}
        />
      </div>
      <div className="flex w-full flex-col overflow-hidden rounded-lg border border-mist-200 dark:border-mist-800">
        {activeTiers.map((tier, i) => (
          <TierRow
            key={tier}
            tier={tier}
            titles={tierGroups[tier] ?? []}
            items={items}
            isLast={i === activeTiers.length - 1}
          />
        ))}
      </div>
      {(canAddTier || canRemoveTier) && (
        <div className="flex w-full flex-row items-center justify-between gap-2">
          {canAddTier && (
            <button
              type="button"
              onClick={onAddTier}
              className={[
                "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-bold transition-colors",
                buttonVariantClasses.outlined.default,
                buttonSizeClasses.small,
              ].join(" ")}
            >
              +
            </button>
          )}
          {canRemoveTier && (
            <button
              type="button"
              onClick={onRemoveBottomTier}
              className={[
                "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-bold transition-colors",
                buttonVariantClasses.outlined.default,
                buttonSizeClasses.small,
              ].join(" ")}
            >
              -
            </button>
          )}
        </div>
      )}
    </section>
  );
}

type TierRowProps = {
  tier: string;
  titles: string[];
  items: { title: string; image?: string }[];
  isLast: boolean;
};

function TierRow({ tier, titles, items, isLast }: TierRowProps) {
  const { ref, isDropTarget } = useDroppable({
    id: tier,
    type: "column",
    accept: "item",
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <div
      className={[
        "flex min-h-34 w-full items-stretch",
        !isLast ? "border-b border-mist-200 dark:border-mist-800" : "",
      ].join(" ")}
    >
      <div
        className={[
          "flex w-14 shrink-0 items-center justify-center text-2xl font-bold text-white",
          TIER_COLORS[tier] ?? "bg-neutral-400 dark:bg-neutral-600",
        ].join(" ")}
      >
        {tier}
      </div>
      <div
        ref={ref}
        className={[
          "flex flex-1 flex-wrap gap-3 p-3 transition-colors",
          isDropTarget
            ? "bg-emerald-100 dark:bg-emerald-950"
            : "bg-mist-100 dark:bg-mist-950",
        ].join(" ")}
      >
        {titles.map((title, index) => {
          const item = items.find((i) => i.title === title);
          return (
            <SortableItemTile
              key={title}
              id={title}
              index={index}
              group={tier}
              title={title}
              image={item?.image}
            />
          );
        })}
        {titles.length === 0 && (
          <p className="m-auto text-sm text-neutral-500 dark:text-neutral-400">
            Drag items here
          </p>
        )}
      </div>
    </div>
  );
}

function UnrankedZone({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const rankingformat = parseRankingFormatParam(searchParams.get("format"));

  const { ref, isDropTarget } = useDroppable({
    id: "unranked",
    type: "column",
    accept: "item",
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <section className="flex w-full flex-col gap-4">
      <div className="flex w-full items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-subheading">Unranked</h2>
        <ButtonLink
          href={`/add-data?method=manual&rankingflow=ranking&rankingformat=${rankingformat}`}
          variant="outlined"
          size="small"
          className="shrink-0"
        >
          Add More
        </ButtonLink>
      </div>
      <div
        ref={ref}
        className={[
          "grid w-full min-h-40 grid-cols-[repeat(auto-fill,minmax(6rem,max-content))] place-content-center justify-items-center gap-3 rounded-lg p-4 transition-colors",
          isDropTarget
            ? "bg-emerald-100 dark:bg-emerald-950"
            : "bg-mist-100 dark:bg-mist-950",
        ].join(" ")}
      >
        {children}
        {!children || (Array.isArray(children) && children.length === 0) ? (
          <p className="col-span-full m-auto text-sm text-neutral-500 dark:text-neutral-400">
            All items have been ranked
          </p>
        ) : null}
      </div>
    </section>
  );
}
