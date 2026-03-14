"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AppHeader } from "@/components/common/AppHeader";
import { restaurants } from "@/data/restaurants";
import { usePreferences } from "@/store/preferences-context";

export default function ProfilePage() {
  const { favorites, compareList, recentViewed, selectedUniversityId } = usePreferences();
  const favoriteRestaurants = restaurants.filter((item) => favorites.includes(item.id));
  const recentRestaurants = restaurants.filter((item) => recentViewed.includes(item.id));
  const schoolRestaurants = restaurants.filter((item) => item.universityId === selectedUniversityId);

  const orderHistory = useMemo(() => {
    const source = schoolRestaurants.length > 0 ? schoolRestaurants : restaurants.slice(0, 6);
    const statuses = ["已完成", "已评价", "退款中", "配送中"];
    return source.slice(0, 6).map((item, index) => ({
      id: `order-${item.id}-${index}`,
      restaurantId: item.id,
      restaurantName: item.name,
      amount: item.avgPrice + (index % 3) * 6,
      itemCount: 1 + (index % 3),
      status: statuses[index % statuses.length] ?? "已完成",
      time: `${index + 1} 天前`,
    }));
  }, [schoolRestaurants]);

  const myReviews = useMemo(() => {
    const source = favoriteRestaurants.length > 0 ? favoriteRestaurants : schoolRestaurants.slice(0, 4);
    return source.slice(0, 4).map((item, index) => ({
      id: `review-${item.id}-${index}`,
      restaurantId: item.id,
      restaurantName: item.name,
      rating: Math.max(3.8, Math.min(5, item.rating - 0.3 + index * 0.2)),
      content:
        index % 2 === 0
          ? "口味很稳，分量也够，和同学一起去基本不踩雷。"
          : "出餐挺快，预算友好，适合课间赶时间吃饭。",
      likes: 8 + index * 9,
      date: `${3 + index} 天前`,
    }));
  }, [favoriteRestaurants, schoolRestaurants]);

  const myPosts = useMemo(() => {
    const source = schoolRestaurants.length > 0 ? schoolRestaurants : restaurants.slice(0, 4);
    return source.slice(0, 4).map((item, index) => ({
      id: `post-${item.id}-${index}`,
      title:
        index % 2 === 0
          ? `实测 ${item.name}：${item.avgPrice} 元能不能吃爽？`
          : `今晚去 ${item.name} 值不值？给大家一份参考`,
      board: index % 2 === 0 ? "平价专区" : "夜宵集合",
      replies: 12 + index * 7,
      likes: 18 + index * 11,
      date: `${2 + index} 天前`,
    }));
  }, [schoolRestaurants]);

  const statusColor = (status: string) => {
    if (status === "已完成" || status === "已评价") {
      return "text-emerald-700 dark:text-emerald-300 bg-emerald-500/10";
    }
    if (status === "配送中") {
      return "text-sky-700 dark:text-sky-300 bg-sky-500/10";
    }
    return "text-amber-700 dark:text-amber-300 bg-amber-500/10";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-background to-rose-50 text-foreground dark:from-[#120c08] dark:via-background dark:to-[#1f130c]">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6">
        <section className="card bg-gradient-to-r from-orange-500 to-rose-500 p-6 text-white dark:from-orange-700 dark:to-rose-700">
          <h1 className="text-2xl font-semibold">个人中心</h1>
          <p className="mt-2 text-sm text-white/85">
            管理你的收藏、对比清单和最近浏览记录，形成自己的校园吃饭档案。
          </p>
        </section>

        <section className="mt-4 grid gap-3 md:grid-cols-3">
          <article className="card p-4">
            <p className="text-sm muted">当前校区</p>
            <p className="mt-2 text-xl font-semibold">{selectedUniversityId.toUpperCase()}</p>
          </article>
          <article className="card p-4">
            <p className="text-sm muted">已收藏餐厅</p>
            <p className="mt-2 text-xl font-semibold">{favorites.length} 家</p>
          </article>
          <article className="card p-4">
            <p className="text-sm muted">对比清单</p>
            <p className="mt-2 text-xl font-semibold">{compareList.length}/3</p>
          </article>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <article className="card p-4">
            <h2 className="text-lg font-semibold">我的收藏</h2>
            {favoriteRestaurants.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm">
                {favoriteRestaurants.map((item) => (
                  <li key={item.id} className="flex items-center justify-between rounded-lg border border-line px-3 py-2">
                    <span>{item.name}</span>
                    <span className="text-orange-600 dark:text-orange-300">¥{item.avgPrice}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm muted">还没有收藏餐厅，去地图页逛一逛。</p>
            )}
          </article>

          <article className="card p-4">
            <h2 className="text-lg font-semibold">最近浏览</h2>
            {recentRestaurants.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm">
                {recentRestaurants.map((item) => (
                  <li key={item.id} className="flex items-center justify-between rounded-lg border border-line px-3 py-2">
                    <span>{item.name}</span>
                    <Link href={`/restaurant/${item.id}`} className="text-orange-600 hover:text-orange-500 dark:text-orange-300">
                      再看一次
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm muted">暂无最近浏览记录。</p>
            )}
          </article>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-3">
          <article className="card p-4">
            <h2 className="text-lg font-semibold">历史订单</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {orderHistory.map((order) => (
                <li key={order.id} className="rounded-lg border border-line p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{order.restaurantName}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs muted">
                    {order.itemCount} 件商品 · ¥{order.amount} · {order.time}
                  </p>
                  <Link
                    href={`/restaurant/${order.restaurantId}`}
                    className="mt-2 inline-block text-xs text-orange-600 hover:text-orange-500 dark:text-orange-300"
                  >
                    再来一单
                  </Link>
                </li>
              ))}
            </ul>
          </article>

          <article className="card p-4">
            <h2 className="text-lg font-semibold">我的评论</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {myReviews.map((review) => (
                <li key={review.id} className="rounded-lg border border-line p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{review.restaurantName}</p>
                    <span className="text-orange-600 dark:text-orange-300">
                      {review.rating.toFixed(1)} 分
                    </span>
                  </div>
                  <p className="mt-1 text-xs muted">{review.content}</p>
                  <p className="mt-2 text-xs muted">
                    👍 {review.likes} · {review.date}
                  </p>
                </li>
              ))}
            </ul>
          </article>

          <article className="card p-4">
            <h2 className="text-lg font-semibold">我的帖子</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {myPosts.map((post) => (
                <li key={post.id} className="rounded-lg border border-line p-3">
                  <p className="font-medium">{post.title}</p>
                  <p className="mt-1 text-xs muted">
                    板块：{post.board} · {post.date}
                  </p>
                  <p className="mt-2 text-xs text-orange-600 dark:text-orange-300">
                    回复 {post.replies} · 点赞 {post.likes}
                  </p>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}

