import GetStartedSection from "../components/GetStartedSection";

export default function Home() {
  return (
    <main className="flex flex-1 w-full flex-col items-center sm:items-start">
      <div className="flex flex-col items-center text-center sm:items-start sm:text-left mb-16">
        <h1
          className={`max-w-3xl text-5xl font-bold leading-12 tracking-tight mb-4 text-heading`}
        >
          The best site for ranking media
        </h1>
        <p className={`max-w-3xl text-lg leading-8 mb-8 text-subheading`}>
          Create tier lists or ordered lists, make them manually or with our
          comparisons tool
        </p>
        <p className={`max-w-3xl text-lg leading-8 text-body`}>
          Enter your data manually, by a JSON import or by using one of our
          integrations including: Backloggd, Steam (coming soon), Board Game
          Geek (coming soon) and Spotify (coming soon). If there are other
          services you want integrated feel free to open a{" "}
          <a
            href="https://github.com/maxnankivell/ranking-website/issues/new"
            className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            feature request on GitHub
          </a>{" "}
          (you will need a Github account to do this sorry).
        </p>
      </div>
      <GetStartedSection />
    </main>
  );
}
