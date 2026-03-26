import type { Metadata } from "next";
import ComparisonsClient from "./ComparisonsClient";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Comparisons() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <ComparisonsClient />
    </div>
  );
}
