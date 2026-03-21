"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "./Button";
import CardSelector from "./CardSelector";

const demoOptions = [
  { value: "manual", label: "Manual Entry" },
  { value: "json", label: "JSON Import" },
  { value: "backloggd", label: "Backloggd" },
  { value: "steam", label: "Steam (Coming soon)", disabled: true },
  {
    value: "boardgamegeek",
    label: "Board Game Geek (Coming soon)",
    disabled: true,
  },
  { value: "spotify", label: "Spotify (Coming soon)", disabled: true },
];

export default function GetStartedSection() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4 w-full items-center text-center sm:items-start sm:text-left">
      <CardSelector
        label="Please Select Your Method"
        options={demoOptions}
        columnsBelowSm={1}
        columnsSm={2}
        columnsMd={3}
        value={selected}
        onChange={setSelected}
      />
      <Button
        size="medium"
        disabled={selected === null}
        onClick={() => {
          if (selected === null) return;
          router.push(`/add-data?method=${encodeURIComponent(selected)}`);
        }}
      >
        Get Started
      </Button>
    </div>
  );
}
