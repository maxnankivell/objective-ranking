"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "./Button";
import CardSelector from "./CardSelector";

const demoOptions = [
  { value: "manual", label: "Manual Entry" },
  { value: "json", label: "JSON Import" },
  { value: "backloggd", label: "Backloggd" },
  { value: "steam", label: "Steam (Coming soon)" },
  { value: "boardgamegeek", label: "Board Game Geek (Coming soon)" },
  { value: "spotify", label: "Spotify (Coming soon)" },
];

export default function GetStartedSection() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4 w-full items-start">
      <CardSelector
        label="Please Select Your Method"
        options={demoOptions}
        columns={3}
        value={selected}
        onChange={setSelected}
      />
      <Button
        size="medium"
        disabled={selected === null}
        onClick={() => {
          if (selected === null) return;
          router.push(
            `/add-data?method=${encodeURIComponent(selected)}`,
          );
        }}
      >
        Get Started
      </Button>
    </div>
  );
}
