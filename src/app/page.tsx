"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/common/AppHeader";
import { RevealSection } from "@/components/common/RevealSection";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { RestaurantCompare } from "@/components/restaurant/RestaurantCompare";
import { restaurants } from "@/data/restaurants";
import { universities } from "@/data/universities";
import {
  getRecommendations,
  pickRandomRestaurant,
} from "@/lib/recommendation";
import { defaultFilter } from "@/lib/restaurant-utils";
import { usePreferences } from "@/store/preferences-context";
import { getCampusBannerSlides, getCampusHeroImages } from "@/lib/food-visuals";

export default function Home() {
  const { selectedUniversityId } = usePreferences();
  const [budgetQuickPick, setBudgetQuickPick] = useState(35);
  const [surpriseSeed, setSurpriseSeed] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const school = useMemo(
    () => universities.find((item) => item.id === selectedUniversityId) ?? universities[0],
    [selectedUniversityId],
  );
  const schoolRestaurants = useMemo(
    () => restaurants.filter((item) => item.universityId === school.id),
    [school.id],
  );

  const ranked = useMemo(
    () =>
      getRecommendations(
        schoolRestaurants,
        { ...defaultFilter, universityId: school.id, maxBudget: budgetQuickPick },
        school.center,
      ),
    [schoolRestaurants, school.center, school.id, budgetQuickPick],
  );

  const randomPick = useMemo(() => {
    if (surpriseSeed < 0) {
      return null;
    }
    return pickRandomRestaurant(ranked);
  }, [ranked, surpriseSeed]);
  const saverRank = useMemo(
    () =>
      [...schoolRestaurants]
        .filter((item) => item.avgPrice <= 25)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3),
    [schoolRestaurants],
  );
  const lateNightRank = useMemo(
    () =>
      [...schoolRestaurants]
        .filter((item) => item.isOpenLate)
        .sort((a, b) => b.heat - a.heat)
        .slice(0, 3),
    [schoolRestaurants],
  );
  const topFive = useMemo(() => ranked.slice(0, 5), [ranked]);
  const topFiveStats = useMemo(() => {
    if (topFive.length === 0) {
      return { avgPrice: 0, avgRating: 0, lateNightCount: 0 };
    }
    const avgPrice =
      topFive.reduce((sum, item) => sum + item.restaurant.avgPrice, 0) / topFive.length;
    const avgRating =
      topFive.reduce((sum, item) => sum + item.restaurant.rating, 0) / topFive.length;
    const lateNightCount = topFive.filter((item) => item.restaurant.isOpenLate).length;
    return {
      avgPrice: Number(avgPrice.toFixed(1)),
      avgRating: Number(avgRating.toFixed(1)),
      lateNightCount,
    };
  }, [topFive]);
  const mealTimePicks = useMemo(() => {
    const breakfast = schoolRestaurants.find((item) => item.avgPrice <= 20) ?? schoolRestaurants[0];
    const lunch =
      [...schoolRestaurants]
        .sort((a, b) => b.rating - a.rating)
        .find((item) => item.avgPrice <= 35) ?? schoolRestaurants[0];
    const night = schoolRestaurants.find((item) => item.isOpenLate) ?? schoolRestaurants[0];
    return [
      { label: "早餐建议", desc: "快速、暖胃、出餐快", target: breakfast },
      { label: "午餐建议", desc: "高口碑、性价比均衡", target: lunch },
      { label: "夜宵建议", desc: "晚课后可达、营业更晚", target: night },
    ];
  }, [schoolRestaurants]);
  const heroImages = useMemo(() => getCampusHeroImages(school.id), [school.id]);
  const heroSlides = useMemo(() => getCampusBannerSlides(school.id), [school.id]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-background to-rose-50 text-foreground dark:from-[#120c08] dark:via-background dark:to-[#1f130c]">
      <AppHeader transparent />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6">
        <RevealSection>
          <section className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
            <article className="group relative min-h-[320px] overflow-hidden rounded-3xl">
              {heroSlides.map((slide, index) => (
                <Image
                  key={`${slide}-${index}`}
                  src={slide}
                  alt={`${school.name} 主视觉${index + 1}`}
                  fill
                  className={`object-cover transition-all duration-700 ${
                    index === heroIndex ? "scale-100 opacity-100" : "scale-105 opacity-0"
                  }`}
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  style={{ transform: `translateY(${scrollY * 0.12}px)` }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                <p className="text-sm text-white/80">今日策展 · 校园美食灵感流</p>
                <h1 className="mt-2 text-3xl font-bold md:text-4xl">{school.shortName} 吃什么</h1>
                <p className="mt-3 max-w-xl text-sm text-white/85 md:text-base">
                  {school.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {school.hotSpots.map((spot) => (
                    <span
                      key={spot}
                      className="rounded-full border border-white/35 bg-white/10 px-3 py-1 text-xs backdrop-blur"
                    >
                      {spot}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  {heroSlides.map((slide, index) => (
                    <button
                      key={`${slide}-dot`}
                      type="button"
                      onClick={() => setHeroIndex(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        index === heroIndex ? "w-7 bg-amber-300" : "w-2.5 bg-white/60"
                      }`}
                      aria-label={`切换到第${index + 1}张`}
                    />
                  ))}
                </div>
              </div>
            </article>

            <article className="relative min-h-[320px] overflow-hidden rounded-3xl">
              <Image
                src={heroImages.side}
                alt={`${school.name} 侧视觉`}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 35vw"
                style={{ transform: `translateY(${scrollY * 0.08}px)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/35 to-black/45" />
              <div className="absolute left-4 right-4 top-1/2 rounded-2xl border border-white/20 bg-white/15 p-4 text-white shadow-2xl backdrop-blur-md -translate-y-1/2">
                <p className="text-sm text-white/80">今日主推</p>
                <p className="mt-1 text-2xl font-bold">{ranked[0]?.restaurant.name ?? "热榜餐厅"}</p>
                <p className="mt-2 text-sm text-white/85">
                  {ranked[0]?.restaurant.specialties.slice(0, 2).join(" · ") ?? "热门特色菜"}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-semibold">
                    ¥{ranked[0]?.restaurant.avgPrice ?? budgetQuickPick}
                  </span>
                  <Link
                    href="/map"
                    className="rounded-full bg-amber-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-200"
                  >
                    立即探索
                  </Link>
                </div>
              </div>
            </article>
          </section>
        </RevealSection>

        <RevealSection>
          <section className="card bg-gradient-to-r from-orange-500 to-rose-500 p-5 text-white dark:from-orange-700 dark:to-rose-700">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-white/80">校园风味导航</p>
                <p className="mt-1 text-base font-medium">
                  已收录 <span className="text-amber-200">{schoolRestaurants.length}</span> 家本地餐厅
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/map"
                  className="rounded-lg bg-white/90 px-4 py-2 text-sm text-slate-900 hover:bg-white dark:bg-amber-100 dark:hover:bg-amber-50"
                >
                  地图探索
                </Link>
              </div>
            </div>
          </section>
        </RevealSection>

        <RevealSection className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <article className="card p-4">
            <h2 className="text-lg font-semibold">不知道吃什么？</h2>
            <p className="mt-1 text-sm muted">
              结合预算、评分、距离和热度，随机从高匹配候选里帮你抽一家。
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="text-sm muted">
                预算上限：¥{budgetQuickPick}
                <input
                  type="range"
                  min={15}
                  max={80}
                  value={budgetQuickPick}
                  onChange={(event) => setBudgetQuickPick(Number(event.target.value))}
                  className="ml-2 align-middle"
                />
              </label>
              <button
                type="button"
                onClick={() => setSurpriseSeed((prev) => prev + 1)}
                className="rounded-lg border border-line px-3 py-1.5 text-sm hover:border-orange-500 hover:text-orange-600"
              >
                换一家
              </button>
            </div>
            {randomPick ? (
              <div className="mt-4">
                <RestaurantCard
                  restaurant={randomPick.restaurant}
                  walkMinutes={randomPick.walkMinutes}
                  distanceKm={randomPick.distanceKm}
                  score={randomPick.score}
                  reasons={randomPick.reasons}
                />
              </div>
            ) : (
              <p className="mt-4 text-sm muted">当前条件下没有结果，放宽预算或标签试试。</p>
            )}
          </article>

          <article className="card p-4">
            <h2 className="text-lg font-semibold">今日推荐 Top 5</h2>
            <ul className="mt-3 space-y-2">
              {topFive.map((item, index) => (
                <li
                  key={item.restaurant.id}
                  className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-sm"
                >
                  <span>
                    {index + 1}. {item.restaurant.name}
                  </span>
                  <span className="text-orange-600">{(item.score * 100).toFixed(1)}%</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg border border-line bg-orange-500/5 px-3 py-2">
                <p className="text-xs muted">Top5 平均评分</p>
                <p className="mt-1 text-base font-semibold text-orange-700 dark:text-orange-300">
                  {topFiveStats.avgRating}
                </p>
              </div>
              <div className="rounded-lg border border-line bg-orange-500/5 px-3 py-2">
                <p className="text-xs muted">Top5 平均人均</p>
                <p className="mt-1 text-base font-semibold text-orange-700 dark:text-orange-300">
                  ¥{topFiveStats.avgPrice}
                </p>
              </div>
              <div className="rounded-lg border border-line bg-orange-500/5 px-3 py-2">
                <p className="text-xs muted">可夜宵店数</p>
                <p className="mt-1 text-base font-semibold text-orange-700 dark:text-orange-300">
                  {topFiveStats.lateNightCount} 家
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-line p-3">
              <p className="text-sm font-medium">按时段快速决策</p>
              <ul className="mt-2 space-y-2 text-sm">
                {mealTimePicks.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between gap-2 rounded-lg bg-orange-500/5 px-3 py-2"
                  >
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs muted">{item.desc}</p>
                    </div>
                    <span className="text-orange-700 dark:text-orange-300">{item.target?.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </RevealSection>

        <RevealSection className="grid gap-4 md:grid-cols-2">
          <article className="card p-4">
            <h2 className="text-lg font-semibold">本周省钱榜</h2>
            <p className="mt-1 text-sm muted">低预算也能高满意，适合月底吃土期。</p>
            <div className="mt-3 space-y-3">
              {saverRank.map((item) => (
                <RestaurantCard key={item.id} restaurant={item} />
              ))}
            </div>
          </article>

          <article className="card p-4">
            <h2 className="text-lg font-semibold">深夜食堂</h2>
            <p className="mt-1 text-sm muted">晚课后、实验后、社团散场后的高热度选择。</p>
            <div className="mt-3 space-y-3">
              {lateNightRank.map((item) => (
                <RestaurantCard key={item.id} restaurant={item} />
              ))}
            </div>
          </article>
        </RevealSection>

        <RevealSection>
          <RestaurantCompare />
        </RevealSection>
      </main>
    </div>
  );
}
