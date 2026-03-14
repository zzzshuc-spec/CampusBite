"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { universities } from "@/data/universities";
import { usePreferences } from "@/store/preferences-context";

type Props = {
  transparent?: boolean;
};

export function AppHeader({ transparent = false }: Props) {
  const router = useRouter();
  const {
    selectedUniversityId,
    setSelectedUniversityId,
    toggleTheme,
    theme,
  } = usePreferences();
  const [scrolled, setScrolled] = useState(false);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (!transparent) {
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent]);

  const useTransparentStyle = transparent && !scrolled;
  const surfaceClass = useTransparentStyle
    ? theme === "dark"
      ? "border-amber-700/40 bg-amber-900/70 backdrop-blur-md"
      : "border-amber-200/60 bg-amber-200/90 backdrop-blur-md"
    : theme === "dark"
      ? "border-amber-700/45 bg-amber-950/86 backdrop-blur-md"
      : "border-amber-200/70 bg-amber-100/95 backdrop-blur-md";
  const textClass = useTransparentStyle ? "text-amber-900" : "text-foreground";
  const controlClass = useTransparentStyle
    ? theme === "dark"
      ? "border-amber-700/70 bg-black/30 text-amber-100 hover:border-amber-500"
      : "border-amber-400/70 bg-white/70 text-amber-900 hover:border-amber-500"
    : "border-line bg-card hover:border-orange-400";

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = keyword.trim();
    if (!value) {
      router.push("/map");
      return;
    }
    router.push(`/map?q=${encodeURIComponent(value)}`);
  };

  return (
    <header className={`sticky top-0 z-30 border-b transition-all duration-300 ${surfaceClass}`}>
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-[320px] flex-1 items-center gap-2">
          <span className="text-3xl font-black tracking-tight text-orange-700 dark:text-orange-300">
            CampusBite
          </span>
          <span className="rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 px-2 py-1 text-xs font-semibold text-white">
            大学城美食地图
          </span>
        </div>

        <nav className={`flex items-center gap-2 text-sm ${textClass}`}>
          <form onSubmit={handleSearch} className="relative">
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 opacity-70"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20L16.65 16.65" />
            </svg>
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索店铺/菜系"
              className={`w-44 rounded-lg border py-1.5 pl-8 pr-3 text-sm outline-none focus:border-orange-400 ${controlClass}`}
              aria-label="搜索店铺或菜系"
            />
          </form>
          <Link
            href="/"
            className={`rounded-lg border px-3 py-1.5 hover:text-orange-500 ${controlClass}`}
          >
            首页
          </Link>
          <Link
            href="/map"
            className={`rounded-lg border px-3 py-1.5 hover:text-orange-500 ${controlClass}`}
          >
            地图
          </Link>
          <Link
            href="/forum"
            className={`rounded-lg border px-3 py-1.5 hover:text-orange-500 ${controlClass}`}
          >
            论坛
          </Link>
          <Link
            href="/health"
            className={`rounded-lg border px-3 py-1.5 hover:text-orange-500 ${controlClass}`}
          >
            健康饮食
          </Link>
          <Link
            href="/profile"
            className={`rounded-lg border px-3 py-1.5 hover:text-orange-500 ${controlClass}`}
          >
            个人中心
          </Link>
        </nav>

        <select
          className={`rounded-lg border px-3 py-1.5 text-sm outline-none focus:border-orange-400 ${controlClass}`}
          value={selectedUniversityId}
          onChange={(event) => setSelectedUniversityId(event.target.value)}
          aria-label="选择高校"
        >
          {universities.map((school) => (
            <option key={school.id} value={school.id}>
              {school.shortName}
            </option>
          ))}
        </select>

        <button
          className={`rounded-lg border px-3 py-1.5 text-sm ${controlClass}`}
          onClick={toggleTheme}
          type="button"
        >
          {theme === "light" ? "深色模式" : "浅色模式"}
        </button>
      </div>
    </header>
  );
}

