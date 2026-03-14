"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/common/AppHeader";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { MapCanvas } from "@/components/map/MapCanvas";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { restaurants } from "@/data/restaurants";
import { universities } from "@/data/universities";
import { getRecommendations } from "@/lib/recommendation";
import { defaultFilter, filterRestaurants } from "@/lib/restaurant-utils";
import { usePreferences } from "@/store/preferences-context";

function hashCode(seed: string) {
  return seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export default function MapPage() {
  const [query] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }
    const params = new URLSearchParams(window.location.search);
    return params.get("q")?.trim().toLowerCase() ?? "";
  });
  const { selectedUniversityId } = usePreferences();
  const [activeId, setActiveId] = useState<string | undefined>();
  const [liveMode, setLiveMode] = useState(true);
  const [mapMode, setMapMode] = useState<"roads" | "heat" | "track">("roads");
  const [simulatedHour, setSimulatedHour] = useState(20);
  const [crowdBoost, setCrowdBoost] = useState(15);
  const [tick, setTick] = useState(0);
  const [replayRunning, setReplayRunning] = useState(false);
  const [replayProgress, setReplayProgress] = useState(0);
  const [filter, setFilter] = useState({
    ...defaultFilter,
    universityId: selectedUniversityId,
  });

  useEffect(() => {
    if (!liveMode) {
      return;
    }
    const timer = window.setInterval(() => setTick((prev) => prev + 1), 3000);
    return () => window.clearInterval(timer);
  }, [liveMode]);

  useEffect(() => {
    if (mapMode !== "track" || !replayRunning) {
      return;
    }
    const timer = window.setInterval(() => {
      setReplayProgress((prev) => {
        const next = prev + 0.06;
        if (next >= 1) {
          setReplayRunning(false);
          return 1;
        }
        return next;
      });
    }, 320);
    return () => window.clearInterval(timer);
  }, [mapMode, replayRunning]);

  const school = useMemo(
    () => universities.find((item) => item.id === selectedUniversityId) ?? universities[0],
    [selectedUniversityId],
  );

  const schoolRestaurants = useMemo(
    () => restaurants.filter((item) => item.universityId === school.id),
    [school.id],
  );

  const filtered = useMemo(
    () =>
      filterRestaurants(
        schoolRestaurants,
        { ...filter, universityId: school.id },
        school.center,
      ),
    [schoolRestaurants, filter, school.id, school.center],
  );

  const queryMatched = useMemo(() => {
    if (!query) {
      return filtered;
    }
    return filtered.filter((item) => {
      const haystack = [
        item.name,
        item.cuisine,
        item.businessDistrict,
        ...item.tags,
        ...item.specialties,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [filtered, query]);

  const ranked = useMemo(
    () =>
      getRecommendations(
        queryMatched,
        { ...filter, universityId: school.id },
        school.center,
      ),
    [queryMatched, filter, school.id, school.center],
  );

  const sorted = useMemo(() => {
    const base = [...ranked];
    switch (filter.sortBy) {
      case "rating":
        return base.sort((a, b) => b.restaurant.rating - a.restaurant.rating);
      case "priceAsc":
        return base.sort((a, b) => a.restaurant.avgPrice - b.restaurant.avgPrice);
      case "distance":
        return base.sort((a, b) => a.distanceKm - b.distanceKm);
      default:
        return base;
    }
  }, [ranked, filter.sortBy]);

  const liveRows = useMemo(() => {
    return sorted.map((item) => {
      const seed = hashCode(`${item.restaurant.id}${tick}${simulatedHour}`);
      const timeFactor =
        simulatedHour >= 17 || simulatedHour <= 1
          ? 14
          : simulatedHour >= 11 && simulatedHour <= 13
            ? 10
            : 4;
      const wave = ((seed % 17) - 8) * 1.6;
      const liveHeat = Math.max(
        30,
        Math.min(100, Math.round(item.restaurant.heat + timeFactor + crowdBoost + wave)),
      );
      const queueMinutes = Math.max(3, Math.round(liveHeat / 4 + (seed % 6)));
      const discount = Math.max(0, Math.min(28, Math.round((100 - liveHeat) / 4)));
      const statusLabel =
        queueMinutes > 24 ? "高峰拥挤" : queueMinutes > 14 ? "正常排队" : "畅快就餐";
      return {
        ...item,
        liveHeat,
        queueMinutes,
        discount,
        statusLabel,
      };
    });
  }, [sorted, tick, simulatedHour, crowdBoost]);

  const heatOverride = useMemo(
    () =>
      liveRows.reduce<Record<string, number>>((acc, row) => {
        acc[row.restaurant.id] = row.liveHeat;
        return acc;
      }, {}),
    [liveRows],
  );

  const activeLive = liveRows.find((row) => row.restaurant.id === activeId);
  const replayPath = useMemo(
    () =>
      [...liveRows]
        .sort((a, b) => b.liveHeat - a.liveHeat)
        .slice(0, 6)
        .map((row) => ({
          x: row.restaurant.position.x,
          y: row.restaurant.position.y,
          name: row.restaurant.name,
        })),
    [liveRows],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-background to-rose-50 text-foreground dark:from-[#120c08] dark:via-background dark:to-[#1f130c]">
      <AppHeader />
      <main className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[340px_1fr]">
        <div className="space-y-4">
          <FilterPanel
            filter={{ ...filter, universityId: school.id }}
            onChange={(next) => setFilter(next)}
          />
          <section className="card p-4">
            <h2 className="text-base font-semibold">结果统计</h2>
            <p className="mt-2 text-sm muted">当前命中 {liveRows.length} 家餐厅</p>
            {query && (
              <p className="mt-1 text-xs text-orange-700 dark:text-orange-300">
                搜索关键词：{query}
              </p>
            )}
            <div className="mt-3 space-y-2">
              <label className="block text-xs muted">
                时段：{simulatedHour}:00
                <input
                  type="range"
                  min={0}
                  max={23}
                  value={simulatedHour}
                  onChange={(event) => setSimulatedHour(Number(event.target.value))}
                  className="mt-1 w-full"
                />
              </label>
              <label className="block text-xs muted">
                人流强度：{crowdBoost}
                <input
                  type="range"
                  min={0}
                  max={30}
                  value={crowdBoost}
                  onChange={(event) => setCrowdBoost(Number(event.target.value))}
                  className="mt-1 w-full"
                />
              </label>
              <button
                type="button"
                onClick={() => setLiveMode((prev) => !prev)}
                className="w-full rounded-lg border border-line px-3 py-1.5 text-sm hover:border-orange-500 hover:text-orange-600"
              >
                {liveMode ? "暂停实时波动" : "开启实时波动"}
              </button>
            </div>
          </section>
          <section className="card p-4">
            <h2 className="text-base font-semibold">地图模式</h2>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { key: "roads", label: "道路底图" },
                { key: "heat", label: "热力层" },
                { key: "track", label: "轨迹回放" },
              ].map((mode) => (
                <button
                  key={mode.key}
                  type="button"
                  onClick={() => {
                    setMapMode(mode.key as "roads" | "heat" | "track");
                    if (mode.key !== "track") {
                      setReplayRunning(false);
                    }
                  }}
                  className={`rounded-lg border px-2 py-1.5 text-xs ${
                    mapMode === mode.key
                      ? "border-orange-500 bg-orange-500/10 text-orange-600"
                      : "border-line"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            {mapMode === "track" && (
              <div className="mt-3 space-y-2">
                <p className="text-xs muted">
                  回放路线：{replayPath.map((item) => item.name).join(" -> ") || "暂无样本"}
                </p>
                <div className="h-2 overflow-hidden rounded-full bg-orange-100 dark:bg-[#3c2418]">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-rose-500 dark:from-orange-500 dark:to-rose-600"
                    style={{ width: `${Math.round(replayProgress * 100)}%` }}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReplayRunning((prev) => !prev)}
                    className="flex-1 rounded-lg border border-line px-2 py-1.5 text-xs hover:border-orange-500"
                  >
                    {replayRunning ? "暂停回放" : "开始回放"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReplayRunning(false);
                      setReplayProgress(0);
                    }}
                    className="rounded-lg border border-line px-2 py-1.5 text-xs hover:border-orange-500"
                  >
                    重置
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-4">
          <MapCanvas
            data={liveRows.map((item) => item.restaurant)}
            activeId={activeId}
            onPick={(id) => setActiveId(id)}
            heatOverride={heatOverride}
            mapMode={mapMode}
            trajectory={replayPath}
            replayProgress={replayProgress}
          />
          {activeLive && (
            <section className="card grid gap-3 bg-gradient-to-r from-orange-500 to-rose-500 p-4 text-white dark:from-orange-700 dark:to-rose-700 md:grid-cols-4">
              <div>
                <p className="text-xs text-white/80">当前选中</p>
                <p className="mt-1 text-base font-semibold">{activeLive.restaurant.name}</p>
              </div>
              <div>
                <p className="text-xs text-white/80">实时热度</p>
                <p className="mt-1 text-base font-semibold">{activeLive.liveHeat}</p>
              </div>
              <div>
                <p className="text-xs text-white/80">预计排队</p>
                <p className="mt-1 text-base font-semibold">{activeLive.queueMinutes} 分钟</p>
              </div>
              <div>
                <p className="text-xs text-white/80">优惠力度</p>
                <p className="mt-1 text-base font-semibold">{activeLive.discount}% OFF</p>
              </div>
            </section>
          )}
          <section className="grid gap-3 md:grid-cols-2">
            {liveRows.length > 0 ? (
              liveRows.map((item) => (
                <RestaurantCard
                  key={item.restaurant.id}
                  restaurant={item.restaurant}
                  walkMinutes={item.walkMinutes}
                  distanceKm={item.distanceKm}
                  score={Math.min(1, item.score + item.discount / 200)}
                  reasons={[
                    ...item.reasons,
                    `实时状态：${item.statusLabel}（约排队 ${item.queueMinutes} 分钟）`,
                    `优惠力度：${item.discount}% OFF`,
                  ]}
                />
              ))
            ) : (
              <div className="card p-5 text-sm muted">
                没找到匹配餐厅，可尝试降低评分门槛或取消部分标签。
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

