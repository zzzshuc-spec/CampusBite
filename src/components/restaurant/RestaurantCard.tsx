"use client";

import Image from "next/image";
import Link from "next/link";
import { Restaurant } from "@/types/food";
import { usePreferences } from "@/store/preferences-context";
import { getCuisineImage } from "@/lib/food-visuals";

type Props = {
  restaurant: Restaurant;
  walkMinutes?: number;
  distanceKm?: number;
  score?: number;
  reasons?: string[];
};

export function RestaurantCard({
  restaurant,
  walkMinutes,
  distanceKm,
  score,
  reasons = [],
}: Props) {
  const { favorites, compareList, toggleFavorite, toggleCompare } = usePreferences();
  const favorite = favorites.includes(restaurant.id);
  const inCompare = compareList.includes(restaurant.id);
  const cover = getCuisineImage(restaurant.cuisine, restaurant.id);

  return (
    <article className="card group overflow-hidden p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/15">
      <div className="relative mb-3 h-28 overflow-hidden rounded-xl">
        <Image
          src={cover}
          alt={`${restaurant.name} 配图`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 420px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
        <p className="absolute bottom-2 left-3 text-sm font-medium text-white">
          {restaurant.cuisine} · {restaurant.businessDistrict}
        </p>
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">{restaurant.name}</h3>
          <p className="mt-1 text-sm muted">
            {restaurant.businessDistrict} · {restaurant.cuisine}
          </p>
        </div>
        <span className="rounded-full bg-orange-500/10 px-2 py-1 text-xs font-medium text-orange-700 dark:text-orange-300">
          {restaurant.rating.toFixed(1)} 分
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <p className="muted">人均 ¥{restaurant.avgPrice}</p>
        <p className="muted">营业 {restaurant.openHours}</p>
        <p className="muted">{restaurant.reviewCount} 条评价</p>
        <p className="muted">{restaurant.isOpenLate ? "可夜宵" : "常规时段"}</p>
        {typeof walkMinutes === "number" && <p className="muted">步行约 {walkMinutes} 分钟</p>}
        {typeof distanceKm === "number" && <p className="muted">距离约 {distanceKm} km</p>}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {restaurant.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-full border border-line px-2 py-1 text-xs muted">
            {tag}
          </span>
        ))}
      </div>

      {typeof score === "number" && (
        <p className="mt-3 text-xs text-orange-700 dark:text-orange-300">
          推荐匹配分 {(score * 100).toFixed(1)}%
        </p>
      )}
      {reasons.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs muted">
          {reasons.slice(0, 2).map((reason) => (
            <li key={reason}>- {reason}</li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link
          href={`/restaurant/${restaurant.id}`}
          className="rounded-lg bg-orange-600 px-3 py-1.5 text-sm text-white hover:bg-orange-500"
        >
          查看详情
        </Link>
        <button
          type="button"
          onClick={() => toggleFavorite(restaurant.id)}
          className="rounded-lg border border-line px-3 py-1.5 text-sm hover:border-orange-500"
        >
          {favorite ? "已收藏" : "收藏"}
        </button>
        <button
          type="button"
          onClick={() => toggleCompare(restaurant.id)}
          className="rounded-lg border border-line px-3 py-1.5 text-sm hover:border-orange-500"
        >
          {inCompare ? "取消对比" : "加入对比"}
        </button>
      </div>
    </article>
  );
}

