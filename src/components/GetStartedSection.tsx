"use client";

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
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4 w-full items-start">
      <CardSelector
        options={demoOptions}
        columns={3}
        value={selected}
        onChange={setSelected}
        ariaLabel="Choose an option"
      />
      <Button size="medium">Get Started</Button>
    </div>
  );
}
