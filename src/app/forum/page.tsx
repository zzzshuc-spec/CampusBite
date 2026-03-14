"use client";

import { AppHeader } from "@/components/common/AppHeader";

const topics = [
  {
    title: "今天学校周边有什么新店？",
    author: "计科23级 小林",
    replies: 28,
    hot: "🔥 热帖",
  },
  {
    title: "30元内吃撑挑战，欢迎补充店铺",
    author: "化学22级 阿泽",
    replies: 61,
    hot: "💬 讨论",
  },
  {
    title: "夜宵党集合：凌晨还开门的店有哪些",
    author: "医学院 夜班生",
    replies: 45,
    hot: "🌙 夜宵",
  },
  {
    title: "考试周安静就餐地图（可学习）",
    author: "法学24级 Mia",
    replies: 19,
    hot: "📚 学习",
  },
];

const boards = [
  { name: "新品情报", posts: 42, desc: "新开店、限时套餐、折扣活动" },
  { name: "平价专区", posts: 66, desc: "30元以内吃饱吃好合集" },
  { name: "夜宵集合", posts: 38, desc: "晚课后和夜班后的靠谱去处" },
];

const rankList = [
  "值班食堂2号档",
  "南门深夜烧烤",
  "书香小灶",
  "金枫夜宵鸡公煲",
  "星湖牛肉粉",
];

export default function ForumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-background to-amber-50 text-foreground dark:from-[#120c08] dark:via-background dark:to-[#1f130c]">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6">
        <section className="card bg-gradient-to-r from-orange-500 to-rose-500 p-6 text-white dark:from-orange-700 dark:to-rose-700">
          <h1 className="text-2xl font-semibold">校园美食论坛</h1>
          <p className="mt-2 text-sm text-orange-50/90">
            分享踩店体验、避雷信息、拼饭邀约，让“吃什么”这件事更轻松。
          </p>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.75fr]">
          <div className="space-y-3">
            {topics.map((item) => (
              <article
                key={item.title}
                className="card p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-orange-900/25"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-medium">{item.title}</h2>
                    <p className="mt-1 text-sm muted">发帖人：{item.author}</p>
                  </div>
                  <span className="rounded-full bg-orange-500/10 px-2 py-1 text-xs text-orange-600 dark:text-orange-300">
                    {item.hot}
                  </span>
                </div>
                <p className="mt-3 text-sm muted">回复数：{item.replies}</p>
              </article>
            ))}
          </div>

          <aside className="space-y-3">
            <article className="card p-4">
              <h2 className="text-lg font-semibold">讨论版块</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {boards.map((board) => (
                  <li key={board.name} className="rounded-lg border border-line px-3 py-2">
                    <p className="font-medium">{board.name}</p>
                    <p className="mt-1 text-xs muted">{board.desc}</p>
                    <p className="mt-1 text-xs text-orange-600 dark:text-orange-300">
                      {board.posts} 帖
                    </p>
                  </li>
                ))}
              </ul>
            </article>

            <article className="card p-4">
              <h2 className="text-lg font-semibold">本周热店榜</h2>
              <ol className="mt-3 space-y-2 text-sm">
                {rankList.map((name, index) => (
                  <li key={name} className="flex items-center justify-between rounded-lg border border-line px-3 py-2">
                    <span>
                      {index + 1}. {name}
                    </span>
                    <span className="text-orange-600 dark:text-orange-300">热</span>
                  </li>
                ))}
              </ol>
            </article>
          </aside>
        </section>
      </main>
    </div>
  );
}

