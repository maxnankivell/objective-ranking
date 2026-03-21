"use client";

import { useRef, useState } from "react";
import { useRankingData } from "../contexts/RankingDataContext";
import Button from "./Button";

export default function ManualAdd() {
  const { addItem, items } = useRankingData();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const duplicate = items.some(
      (item) => item.title.toLowerCase() === trimmedTitle.toLowerCase(),
    );
    if (duplicate) {
      setTitleError("Title already exists in list");
      return;
    }

    setTitleError(null);
    addItem({
      title: trimmedTitle,
      image: image.trim() || undefined,
    });

    setTitle("");
    setImage("");
    titleInputRef.current?.focus();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold text-subheading">Add items manually</h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="manual-title" className="text-sm font-bold text-body">
          Title
        </label>
        <input
          ref={titleInputRef}
          id="manual-title"
          type="text"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError(null);
          }}
          aria-invalid={titleError ? true : undefined}
          className="rounded-lg border-2 border-neutral-300 bg-transparent px-3 py-2 text-sm text-body outline-none transition-colors focus:border-emerald-500 dark:border-neutral-700 dark:focus:border-emerald-500"
        />
        {titleError && (
          <p className="text-sm text-red-500" role="alert">
            {titleError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="manual-image" className="text-sm font-bold text-body">
          Image
        </label>
        <input
          id="manual-image"
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="rounded-lg border-2 border-neutral-300 bg-transparent px-3 py-2 text-sm text-body outline-none transition-colors focus:border-emerald-500 dark:border-neutral-700 dark:focus:border-emerald-500"
        />
      </div>

      <Button type="submit" variant="outlined" size="small">
        Add
      </Button>
    </form>
  );
}
