"use client";

import { Restaurant } from "@/types/food";

type MapMode = "roads" | "heat" | "track";

type Props = {
  data: Restaurant[];
  onPick: (id: string) => void;
  activeId?: string;
  heatOverride?: Record<string, number>;
  mapMode: MapMode;
  trajectory: Array<{ x: number; y: number; name: string }>;
  replayProgress: number;
};

function buildPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) {
    return "";
  }
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

export function MapCanvas({
  data,
  onPick,
  activeId,
  heatOverride = {},
  mapMode,
  trajectory,
  replayProgress,
}: Props) {
  const canvasW = 100;
  const canvasH = 100;
  const path = buildPath(trajectory);
  const progressPoint =
    trajectory[Math.min(trajectory.length - 1, Math.floor(replayProgress * trajectory.length))];

  return (
    <section className="card p-4">
      <h2 className="text-base font-semibold">校园周边地图</h2>
      <p className="mt-1 text-sm muted">
        当前模式：
        {mapMode === "roads" && "道路底图"}
        {mapMode === "heat" && "热力层"}
        {mapMode === "track" && "轨迹回放"}
      </p>
      <div className="relative mt-3 h-[420px] overflow-hidden rounded-xl border border-line bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
        <div className="pointer-events-none absolute inset-0 opacity-65 [background-image:linear-gradient(to_right,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="pointer-events-none absolute left-[8%] top-[20%] h-[3px] w-[50%] rotate-12 rounded-full bg-white/50" />
        <div className="pointer-events-none absolute left-[30%] top-[56%] h-[3px] w-[58%] -rotate-6 rounded-full bg-white/45" />
        <div className="pointer-events-none absolute left-[56%] top-[14%] h-[58%] w-[3px] rotate-8 rounded-full bg-white/35" />
        <div className="pointer-events-none absolute left-[6%] top-[65%] h-[3px] w-[40%] -rotate-12 rounded-full bg-white/35" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(249,115,22,0.18),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(244,63,94,0.16),transparent_35%)]" />
        <div className="pointer-events-none absolute left-[11%] top-[24%] rounded-full bg-black/30 px-2 py-1 text-[10px] text-white">
          星湖美食街
        </div>
        <div className="pointer-events-none absolute right-[10%] top-[16%] rounded-full bg-black/30 px-2 py-1 text-[10px] text-white">
          康宁广场
        </div>
        <div className="pointer-events-none absolute left-[42%] bottom-[12%] rounded-full bg-black/30 px-2 py-1 text-[10px] text-white">
          青木里
        </div>

        {mapMode === "heat" &&
          data.map((item) => {
            const liveHeat = heatOverride[item.id] ?? item.heat;
            const radius = 22 + Math.round(liveHeat / 2.6);
            return (
              <div
                key={`${item.id}-heat`}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  left: `${item.position.x}%`,
                  top: `${item.position.y}%`,
                  width: `${radius}px`,
                  height: `${radius}px`,
                  background:
                    "radial-gradient(circle, rgba(239,68,68,0.35) 0%, rgba(251,146,60,0.2) 35%, rgba(251,191,36,0) 70%)",
                }}
              />
            );
          })}

        {mapMode === "track" && trajectory.length > 1 && (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 ${canvasW} ${canvasH}`}
            preserveAspectRatio="none"
          >
            <path
              d={path}
              fill="none"
              stroke="rgba(234,88,12,0.9)"
              strokeWidth="1.2"
              strokeDasharray="2.8 1.4"
              strokeLinecap="round"
            />
          </svg>
        )}

        {mapMode === "track" && progressPoint && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-orange-500 shadow-[0_0_14px_rgba(249,115,22,0.85)]"
            style={{ left: `${progressPoint.x}%`, top: `${progressPoint.y}%`, width: 14, height: 14 }}
          />
        )}

        {data.map((item) => {
          const isActive = item.id === activeId;
          const liveHeat = heatOverride[item.id] ?? item.heat;
          const markerSize = isActive ? 28 : 14 + Math.round(liveHeat / 22);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onPick(item.id)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white text-white shadow-lg transition-transform hover:scale-110 ${
                isActive ? "ring-4 ring-orange-400/60" : ""
              }`}
              style={{
                left: `${item.position.x}%`,
                top: `${item.position.y}%`,
                width: `${markerSize}px`,
                height: `${markerSize}px`,
                backgroundColor:
                  mapMode === "heat"
                    ? `rgba(239,68,68,${0.35 + liveHeat / 190})`
                    : `rgba(249,115,22,${0.35 + liveHeat / 190})`,
              }}
              aria-label={`查看${item.name}`}
            />
          );
        })}
        {data.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="rounded-xl border border-white/40 bg-black/30 px-4 py-2 text-sm text-white backdrop-blur">
              当前筛选条件暂无餐厅，请放宽预算或标签
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

