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

export const TIER_LETTERS = ["S", "A", "B"] as const;
export type TierLetter = (typeof TIER_LETTERS)[number];

export type TierGroups = {
  S: string[];
  A: string[];
  B: string[];
  unranked: string[];
};

export function deriveTierGroups(items?: RankingData[]): TierGroups {
  const tiers: { S: string[]; A: string[]; B: string[] } = {
    S: [],
    A: [],
    B: [],
  };
  const unranked: string[] = [];
  items?.forEach((item) => {
    if (item.tier === "S" || item.tier === "A" || item.tier === "B") {
      tiers[item.tier].push(item.title);
    } else {
      unranked.push(item.title);
    }
  });
  return { ...tiers, unranked };
}
