"use client";

import { useRankingData } from "../contexts/RankingDataContext";
import Button from "./Button";
import ItemTile from "./ItemTile";

type ItemsPreviewProps = {
  className?: string;
};

export default function ItemsPreview({ className }: ItemsPreviewProps) {
  const { items, removeItemsByTitle, clearItems } = useRankingData();

  if (items.length === 0) return null;

  return (
    <section
      className={["flex w-full flex-col gap-4", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex w-full items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-subheading">
          Items Added So Far
        </h2>
        <Button
          type="button"
          size="small"
          variant="outlined"
          error
          className="shrink-0"
          onClick={clearItems}
        >
          Clear All
        </Button>
      </div>
      <div className="grid w-full min-h-40 grid-cols-[repeat(auto-fill,minmax(5.25rem,max-content))] place-content-center justify-items-center gap-3 rounded-lg p-4 transition-colors bg-mist-100 dark:bg-mist-950">
        {items.map((item, i) => (
          <ItemTile
            key={`${item.title}-${i}`}
            title={item.title}
            image={item.image}
            onDelete={removeItemsByTitle}
          />
        ))}
      </div>
    </section>
  );
}
