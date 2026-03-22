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
