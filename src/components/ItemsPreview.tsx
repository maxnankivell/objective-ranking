"use client";

import { useRankingData } from "../contexts/RankingDataContext";
import ItemTile from "./ItemTile";

type ItemsPreviewProps = {
  className?: string;
};

export default function ItemsPreview({ className }: ItemsPreviewProps) {
  const { items } = useRankingData();

  if (items.length === 0) return null;

  return (
    <section
      className={["flex w-full flex-col gap-4", className]
        .filter(Boolean)
        .join(" ")}
    >
      <h2 className="text-2xl font-bold text-subheading">Items Added So Far</h2>
      <div className="flex flex-wrap gap-3 rounded-lg bg-mist-50 p-4 dark:bg-mist-950">
        {items.map((item, i) => (
          <ItemTile
            key={`${item.title}-${i}`}
            title={item.title}
            image={item.image}
          />
        ))}
      </div>
    </section>
  );
}
