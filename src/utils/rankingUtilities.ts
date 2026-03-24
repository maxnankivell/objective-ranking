import type { RankingData } from "../types/RankingData";

export type Groups = {
  ranked: string[];
  unranked: string[];
};

export function deriveGroups(items?: RankingData[]): Groups {
  const ranked =
    items
      ?.filter((i) => i.rank != null)
      .sort((a, b) => a.rank! - b.rank!)
      .map((i) => i.title) ?? [];
  const unranked =
    items
      ?.filter((i) => i.rank == null)
      .sort(
        (a, b) => (a.unrankedIndex ?? Infinity) - (b.unrankedIndex ?? Infinity),
      )
      .map((i) => i.title) ?? [];
  return { ranked, unranked };
}

export const DEFAULT_TIER_LETTERS = ["S", "A", "B"];
export const ALL_TIER_LETTERS = [
  "S",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
];
export const MAX_TIERS = 10;

export type TierGroups = Record<string, string[]>;

export function deriveTierGroups(
  items?: RankingData[],
  activeTiers = DEFAULT_TIER_LETTERS,
): TierGroups {
  const result: TierGroups = { unranked: [] };
  for (const t of activeTiers) result[t] = [];
  items?.forEach((item) => {
    if (item.tier && activeTiers.includes(item.tier))
      result[item.tier].push(item.title);
    else result.unranked.push(item.title);
  });
  return result;
}
