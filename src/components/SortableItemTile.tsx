"use client";

import { useSortable } from "@dnd-kit/react/sortable";
import ItemTile from "./ItemTile";

type SortableItemTileProps = {
  id: string;
  index: number;
  group: string;
  title: string;
  image?: string;
  rank?: number;
};

export default function SortableItemTile({
  id,
  index,
  group,
  title,
  image,
  rank,
}: SortableItemTileProps) {
  const { ref, isDragSource } = useSortable({
    id,
    index,
    group,
    type: "item",
    accept: "item",
  });

  return (
    <div
      ref={ref}
      className={[
        "flex flex-col items-center gap-1 touch-none",
        isDragSource ? "opacity-40" : "opacity-100",
      ].join(" ")}
    >
      <ItemTile title={title} image={image} />
      {rank !== undefined && (
        <span className="text-sm font-bold text-subheading">{rank}</span>
      )}
    </div>
  );
}
