"use client";

import { CollisionPriority } from "@dnd-kit/abstract";
import { move } from "@dnd-kit/helpers";
import { DragDropProvider, useDroppable } from "@dnd-kit/react";
import { useEffect, useRef, useState } from "react";
import { useRankingData } from "../contexts/RankingDataContext";
import { deriveGroups, type Groups } from "../utils/rankingUtilities";
import SortableItemTile from "./SortableItemTile";

type RankingBoardProps = {
  className?: string;
};

export default function RankingBoard({ className }: RankingBoardProps) {
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
        <RankedZone>
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
        </RankedZone>

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
    </div>
  );
}

function RankedZone({ children }: { children: React.ReactNode }) {
  const { ref, isDropTarget } = useDroppable({
    id: "ranked",
    type: "column",
    accept: "item",
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <section className="flex w-full flex-col gap-4">
      <h2 className="text-2xl font-bold text-subheading">Ranked</h2>
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
          <p className="m-auto text-sm text-neutral-500 dark:text-neutral-400">
            Drag items here to rank them
          </p>
        ) : null}
      </div>
    </section>
  );
}

function UnrankedZone({ children }: { children: React.ReactNode }) {
  const { ref, isDropTarget } = useDroppable({
    id: "unranked",
    type: "column",
    accept: "item",
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <section className="flex w-full flex-col gap-4">
      <h2 className="text-2xl font-bold text-subheading">Unranked</h2>
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
          <p className="m-auto text-sm text-neutral-500 dark:text-neutral-400">
            All items have been ranked
          </p>
        ) : null}
      </div>
    </section>
  );
}
