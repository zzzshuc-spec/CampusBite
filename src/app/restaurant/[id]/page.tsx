"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { AppHeader } from "@/components/common/AppHeader";
import { getRestaurantMockDetail } from "@/data/restaurant-detail-mock";
import { restaurants } from "@/data/restaurants";
import { universities } from "@/data/universities";
import { calcDistanceKm, estimateWalkMinutes } from "@/lib/walkTime";
import { usePreferences } from "@/store/preferences-context";

export default function RestaurantDetailPage() {
  const params = useParams<{ id: string }>();
  const { favorites, toggleFavorite, toggleCompare, compareList, pushRecentViewed } =
    usePreferences();
  const restaurant = useMemo(
    () => restaurants.find((item) => item.id === params.id),
    [params.id],
  );

  const school = universities.find((item) => item.id === restaurant?.universityId) ?? universities[0];

  useEffect(() => {
    if (restaurant) {
      pushRecentViewed(restaurant.id);
    }
  }, [restaurant, pushRecentViewed]);

  if (!restaurant) {
    notFound();
  }

  const distanceKm = calcDistanceKm(school.campusGate, restaurant.position);
  const walkMinutes = estimateWalkMinutes(distanceKm);
  const favorite = favorites.includes(restaurant.id);
  const inCompare = compareList.includes(restaurant.id);
  const mockDetail = getRestaurantMockDetail(restaurant);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-background to-rose-50 text-foreground dark:from-[#120c08] dark:via-background dark:to-[#1f130c]">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6">
        <Link href="/map" className="text-sm text-orange-600 hover:text-orange-500 dark:text-orange-300">
          ← 返回地图列表
        </Link>

        <section className="card mt-4 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">{restaurant.name}</h1>
              <p className="mt-2 text-sm muted">
                {school.name} · {restaurant.businessDistrict} · {restaurant.cuisine}
              </p>
            </div>
            <span className="rounded-lg bg-orange-500/10 px-3 py-2 text-sm font-medium text-orange-600 dark:text-orange-300">
              评分 {restaurant.rating.toFixed(1)}
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-line p-3">
              <p className="text-sm muted">人均消费</p>
              <p className="mt-1 text-lg font-semibold">¥{restaurant.avgPrice}</p>
            </div>
            <div className="rounded-lg border border-line p-3">
              <p className="text-sm muted">步行时长</p>
              <p className="mt-1 text-lg font-semibold">{walkMinutes} 分钟</p>
            </div>
            <div className="rounded-lg border border-line p-3">
              <p className="text-sm muted">营业时间</p>
              <p className="mt-1 text-lg font-semibold">{restaurant.openHours}</p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-line p-3">
            <h2 className="font-semibold">推荐理由</h2>
            <ul className="mt-2 space-y-1 text-sm muted">
              <li>- 距离校园入口约 {distanceKm} km，日常步行可达。</li>
              <li>- 累计 {restaurant.reviewCount} 条学生评价，可信度高。</li>
              <li>- 学生热度指数 {restaurant.heat}，关注度较高。</li>
            </ul>
          </div>

          <div className="mt-4 rounded-lg border border-line p-3">
            <h2 className="font-semibold">招牌菜</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {restaurant.specialties.map((dish) => (
                <span key={dish} className="rounded-full border border-line px-2 py-1 text-xs">
                  {dish}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-line p-3">
            <h2 className="font-semibold">就餐场景标签</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {restaurant.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-orange-500/10 px-2 py-1 text-xs text-orange-700 dark:text-orange-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-line p-3">
            <h2 className="font-semibold">菜品图片</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {mockDetail.dishGallery.map((dish) => (
                <div key={dish.name} className="relative h-40 overflow-hidden rounded-lg">
                  <Image src={dish.image} alt={dish.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <p className="absolute bottom-2 left-3 text-sm font-medium text-white">{dish.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-line p-3">
            <h2 className="font-semibold">评分结构</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {mockDetail.scoreBreakdown.map((item) => (
                <div key={item.label} className="rounded-lg border border-line p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="text-orange-700 dark:text-orange-300">{item.score.toFixed(1)}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-orange-100 dark:bg-[#3c2418]">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 to-rose-500"
                      style={{ width: `${Math.round((item.score / 5) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {mockDetail.reviewKeywords.map((keyword) => (
                <span key={keyword} className="rounded-full border border-line bg-orange-500/8 px-2 py-1 text-xs">
                  #{keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-line p-3">
            <h2 className="font-semibold">学生评论</h2>
            <div className="mt-3 space-y-3">
              {mockDetail.reviews.map((review) => (
                <article key={review.id} className="rounded-lg border border-line p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{review.userName}</p>
                      <p className="text-xs muted">{review.major} · {review.visitTime}</p>
                    </div>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      {"★".repeat(review.stars)}
                      <span className="text-xs muted">{` (${review.stars}.0)`}</span>
                    </p>
                  </div>
                  <p className="mt-2 text-sm">{review.content}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {review.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-orange-500/10 px-2 py-1 text-xs text-orange-700 dark:text-orange-300">
                        {tag}
                      </span>
                    ))}
                    <span className="ml-auto text-xs muted">👍 {review.likedCount}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => toggleFavorite(restaurant.id)}
              className="rounded-lg border border-line px-4 py-2 text-sm hover:border-orange-500"
            >
              {favorite ? "取消收藏" : "加入收藏"}
            </button>
            <button
              type="button"
              onClick={() => toggleCompare(restaurant.id)}
              className="rounded-lg border border-line px-4 py-2 text-sm hover:border-orange-500"
            >
              {inCompare ? "移出对比" : "加入对比"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

