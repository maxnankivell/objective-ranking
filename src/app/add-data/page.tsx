import type { Metadata } from "next";
import AddDataMethodTabs from "../../components/AddDataMethodTabs";
import AddDataRankingStart from "../../components/AddDataRankingStart";
import ItemsPreview from "../../components/ItemsPreview";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AddData() {
  return (
    <div className="flex flex-1 flex-col w-full items-center sm:items-start text-center sm:text-left">
      <h1 className="max-w-3xl text-5xl font-bold leading-12 tracking-tight mb-4 text-heading">
        Add Your Data
      </h1>
      <p className="max-w-3xl text-lg leading-8 mb-8 text-subheading">
        Enter your data, then choose what kind of ranking to make and how to
        make it.
      </p>
      <AddDataMethodTabs className="mb-8" />
      <AddDataRankingStart className="mb-8" />
      <ItemsPreview className="mb-8" />
    </div>
  );
}
