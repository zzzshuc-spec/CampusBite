"use client";

import { AppHeader } from "@/components/common/AppHeader";

const plans = [
  { scene: "减脂期", suggestion: "轻食 + 高蛋白 + 低糖饮品", budget: "¥22-35" },
  { scene: "增肌期", suggestion: "双拼主食 + 蛋白类 + 蔬菜", budget: "¥28-42" },
  { scene: "考试周", suggestion: "温热汤面 + 坚果酸奶 + 足量饮水", budget: "¥18-30" },
  { scene: "夜宵党", suggestion: "清汤粉面 + 少油配菜，避免过辣", budget: "¥16-26" },
];

const metrics = [
  { name: "蛋白质", target: "20-35g/餐", tip: "优先鸡蛋、牛奶、豆制品" },
  { name: "蔬菜摄入", target: "300g+/天", tip: "每餐至少一份绿叶菜" },
  { name: "饮水量", target: "1500-2000ml/天", tip: "课堂和自习时段定时喝水" },
];

export default function HealthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-background to-orange-50 text-foreground dark:from-[#120c08] dark:via-background dark:to-[#1f130c]">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6">
        <section className="card bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white dark:from-emerald-700 dark:to-teal-700">
          <h1 className="text-2xl font-semibold">健康饮食指南</h1>
          <p className="mt-2 text-sm text-emerald-50/90">
            针对大学生日常场景，提供可执行、低门槛的吃饭建议。
          </p>
        </section>

        <section className="mt-4 grid gap-3 md:grid-cols-3">
          {metrics.map((item) => (
            <article key={item.name} className="card p-4">
              <p className="text-sm muted">{item.name}</p>
              <p className="mt-2 text-xl font-semibold">{item.target}</p>
              <p className="mt-2 text-xs muted">{item.tip}</p>
            </article>
          ))}
        </section>

        <section className="mt-4 grid gap-3 md:grid-cols-2">
          {plans.map((item) => (
            <article key={item.scene} className="card p-4">
              <h2 className="text-lg font-medium">{item.scene}</h2>
              <p className="mt-2 text-sm muted">{item.suggestion}</p>
              <p className="mt-3 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                推荐预算：{item.budget}
              </p>
            </article>
          ))}
        </section>

        <section className="card mt-4 p-4">
          <h2 className="text-lg font-semibold">一周健康打卡建议</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              "周一至周五至少 3 天选择蒸/炖/煮烹饪方式",
              "每天保证 1 份水果 + 1 份优质蛋白",
              "夜宵尽量控制在睡前 2 小时之前",
              "奶茶类饮品每周不超过 2 杯",
            ].map((item) => (
              <li key={item} className="rounded-lg border border-line px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

