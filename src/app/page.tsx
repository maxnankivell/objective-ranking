export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-mist-100 dark:bg-black">
      <main className="flex flex-1 w-full max-w-5xl flex-col items-center py-16 px-16 bg-white dark:bg-mist-900 sm:items-start">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <h1 className="max-w-3xl text-5xl font-bold leading-12 tracking-tight mb-4 text-black dark:text-white">
            The best site for ranking media
          </h1>
          <p className="max-w-3xl text-lg leading-8 mb-8 text-neutral-950 dark:text-neutral-50">
            Create tier lists or ordered lists, make them manually or with our
            comparisons tool
          </p>
          <p className="max-w-3xl text-lg leading-8 text-neutral-800 dark:text-neutral-200">
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
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
