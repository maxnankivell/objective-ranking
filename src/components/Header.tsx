import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";

const interLogo = Inter({
  subsets: ["latin"],
  weight: ["700"],
});

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 h-16 bg-mist-200 dark:bg-black border-b border-foreground/10">
      <Link
        href="/"
        className="flex items-center gap-3 rounded-md outline-offset-4 focus-visible:outline-2 focus-visible:outline-foreground/40"
      >
        <Image
          src="/general/Logo.svg"
          alt="Objective Rankings logo"
          width={32}
          height={32}
          unoptimized
        />
        <span className={`${interLogo.className} text-lg tracking-tight`}>
          Objective Rankings
        </span>
      </Link>
      <ThemeSwitcher />
    </header>
  );
}
