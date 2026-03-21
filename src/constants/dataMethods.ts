export type DataMethodOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export const dataMethods: DataMethodOption[] = [
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
