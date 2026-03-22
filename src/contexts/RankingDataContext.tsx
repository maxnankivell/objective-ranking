"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { RankingData } from "../types/RankingData";

const STORAGE_KEY = "rankingData";

interface RankingDataContextValue {
  items: RankingData[];
  addItem: (item: RankingData) => void;
  addItems: (items: RankingData[]) => void;
  clearItems: () => void;
  removeItemsByTitle: (title: string) => void;
  updateRanks: (ranked: { title: string; rank?: number; unrankedIndex?: number }[]) => void;
}

const RankingDataContext = createContext<RankingDataContextValue | null>(null);

export function RankingDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<RankingData[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(JSON.parse(stored));
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: RankingData) => {
    setItems((prev) => {
      if (prev.some((i) => i.title === item.title)) return prev;
      return [...prev, item];
    });
  }, []);

  const addItems = useCallback((newItems: RankingData[]) => {
    setItems((prev) => {
      const seen = new Set(prev.map((i) => i.title));
      const toAdd: RankingData[] = [];
      for (const item of newItems) {
        if (seen.has(item.title)) continue;
        seen.add(item.title);
        toAdd.push(item);
      }
      if (toAdd.length === 0) return prev;
      return [...prev, ...toAdd];
    });
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  const removeItemsByTitle = useCallback((title: string) => {
    setItems((prev) => prev.filter((item) => item.title !== title));
  }, []);

  const updateRanks = useCallback(
    (ranked: { title: string; rank?: number; unrankedIndex?: number }[]) => {
      setItems((prev) => {
        const updateMap = new Map(
          ranked.map((r) => [r.title, { rank: r.rank, unrankedIndex: r.unrankedIndex }])
        );
        return prev.map((item) => {
          const update = updateMap.get(item.title);
          return update ? { ...item, ...update } : item;
        });
      });
    },
    []
  );

  return (
    <RankingDataContext
      value={{
        items,
        addItem,
        addItems,
        clearItems,
        removeItemsByTitle,
        updateRanks,
      }}
    >
      {children}
    </RankingDataContext>
  );
}

export function useRankingData(): RankingDataContextValue {
  const ctx = useContext(RankingDataContext);
  if (!ctx) {
    throw new Error("useRankingData must be used within a RankingDataProvider");
  }
  return ctx;
}
