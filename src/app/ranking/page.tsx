import type { Metadata } from "next";
import RankingBoard from "../../components/RankingBoard";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Ranking() {
  return (
    <div className="flex flex-1 flex-col w-full items-center sm:items-start text-center sm:text-left">
      <h1 className="max-w-3xl text-5xl font-bold leading-12 tracking-tight mb-4 text-heading">
        Ranking
      </h1>
      <p className="max-w-3xl text-lg leading-8 mb-8 text-subheading">
        Drag items into the ranked area and reorder them to create your ranking.
      </p>
      <RankingBoard className="mb-8" />
    </div>
  );
}
