"use client";

import { restaurants } from "@/data/restaurants";
import { usePreferences } from "@/store/preferences-context";

export function RestaurantCompare() {
  const { compareList, toggleCompare } = usePreferences();
  const selected = restaurants.filter((item) => compareList.includes(item.id));

  if (selected.length === 0) {
    return (
      <section className="card p-4">
        <h2 className="text-base font-semibold">餐厅对比</h2>
        <p className="mt-2 text-sm muted">还没有加入对比项，支持同时对比最多 3 家。</p>
      </section>
    );
  }

  return (
    <section className="card p-4">
      <h2 className="text-base font-semibold">餐厅对比（{selected.length}/3）</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {selected.map((item) => (
          <div key={item.id} className="rounded-lg border border-line p-3">
            <h3 className="font-medium">{item.name}</h3>
            <p className="mt-1 text-xs muted">{item.cuisine}</p>
            <ul className="mt-2 space-y-1 text-xs muted">
              <li>人均: ¥{item.avgPrice}</li>
              <li>评分: {item.rating.toFixed(1)}</li>
              <li>营业: {item.openHours}</li>
              <li>{item.isOpenLate ? "可深夜就餐" : "常规营业"}</li>
            </ul>
            <button
              type="button"
              className="mt-3 rounded-lg border border-line px-2 py-1 text-xs hover:border-indigo-500"
              onClick={() => toggleCompare(item.id)}
            >
              移除
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

