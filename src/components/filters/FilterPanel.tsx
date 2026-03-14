"use client";

import { allCuisines, allTags } from "@/data/restaurants";
import { RestaurantFilter } from "@/types/food";

type Props = {
  filter: RestaurantFilter;
  onChange: (next: RestaurantFilter) => void;
};

export function FilterPanel({ filter, onChange }: Props) {
  const toggleTag = (tag: string) => {
    const exists = filter.selectedTags.includes(tag);
    onChange({
      ...filter,
      selectedTags: exists
        ? filter.selectedTags.filter((item) => item !== tag)
        : [...filter.selectedTags, tag],
    });
  };

  const toggleCuisine = (cuisine: string) => {
    const exists = filter.selectedCuisines.includes(cuisine);
    onChange({
      ...filter,
      selectedCuisines: exists
        ? filter.selectedCuisines.filter((item) => item !== cuisine)
        : [...filter.selectedCuisines, cuisine],
    });
  };

  return (
    <section className="card p-4">
      <h2 className="text-base font-semibold">智能筛选</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <label className="text-sm">
          <span className="muted">预算上限：¥{filter.maxBudget}</span>
          <input
            type="range"
            min={12}
            max={90}
            value={filter.maxBudget}
            onChange={(event) =>
              onChange({
                ...filter,
                maxBudget: Number(event.target.value),
              })
            }
            className="mt-2 w-full"
          />
        </label>
        <label className="text-sm">
          <span className="muted">最低评分：{filter.minRating.toFixed(1)} 分</span>
          <input
            type="range"
            min={3.5}
            max={5}
            step={0.1}
            value={filter.minRating}
            onChange={(event) =>
              onChange({
                ...filter,
                minRating: Number(event.target.value),
              })
            }
            className="mt-2 w-full"
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className={`rounded-lg border px-3 py-1.5 text-sm ${
            filter.onlyOpenNow ? "border-indigo-500 text-indigo-600" : "border-line"
          }`}
          onClick={() =>
            onChange({
              ...filter,
              onlyOpenNow: !filter.onlyOpenNow,
            })
          }
        >
          仅显示营业中
        </button>
        <button
          type="button"
          className={`rounded-lg border px-3 py-1.5 text-sm ${
            filter.onlyLateNight ? "border-indigo-500 text-indigo-600" : "border-line"
          }`}
          onClick={() =>
            onChange({
              ...filter,
              onlyLateNight: !filter.onlyLateNight,
            })
          }
        >
          深夜食堂
        </button>
      </div>

      <div className="mt-4">
        <p className="text-sm muted">菜系</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {allCuisines.map((cuisine) => (
            <button
              key={cuisine}
              type="button"
              className={`rounded-full border px-2 py-1 text-xs ${
                filter.selectedCuisines.includes(cuisine)
                  ? "border-indigo-500 text-indigo-600"
                  : "border-line muted"
              }`}
              onClick={() => toggleCuisine(cuisine)}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm muted">标签</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`rounded-full border px-2 py-1 text-xs ${
                filter.selectedTags.includes(tag)
                  ? "border-indigo-500 text-indigo-600"
                  : "border-line muted"
              }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm muted" htmlFor="sort-by">
          排序方式
        </label>
        <select
          id="sort-by"
          value={filter.sortBy}
          onChange={(event) =>
            onChange({
              ...filter,
              sortBy: event.target.value as RestaurantFilter["sortBy"],
            })
          }
          className="mt-2 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm"
        >
          <option value="recommend">推荐优先</option>
          <option value="rating">评分优先</option>
          <option value="priceAsc">价格从低到高</option>
          <option value="distance">距离最近</option>
        </select>
      </div>
    </section>
  );
}

