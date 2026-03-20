"use client";

import { useState } from "react";

import ToggleButton from "../components/ToggleButton";

const OPTIONS = [
  { value: "tier", label: "Tier list" },
  { value: "ordered", label: "Ordered list" },
  { value: "ordered1", label: "Ordered list htoethu htohtuohet" },
] as const;

export default function HomeToggleClient() {
  const [value, setValue] = useState<string>(OPTIONS[0].value);

  return (
    <ToggleButton
      aria-label="List type"
      options={[...OPTIONS]}
      value={value}
      onChange={setValue}
    />
  );
}
