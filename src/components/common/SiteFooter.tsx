import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-line bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100 text-foreground dark:from-[#2a1a12] dark:via-[#24170f] dark:to-[#311a16] dark:text-[#ffe9dc]">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-7 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <section>
          <p className="text-3xl font-black tracking-tight text-orange-700 dark:text-orange-300">
            CampusBite
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-orange-600/80 dark:text-orange-200/80">
            University Food Atlas
          </p>
          <p className="mt-4 text-sm font-semibold">大学城美食地图运营中心</p>
          <p className="mt-3 text-sm">Tel: 400-889-2277</p>
          <p className="text-sm">E-mail: support@campusbite.cn</p>
          <nav className="mt-5 flex flex-wrap gap-2 text-sm">
            <Link href="/" className="hover:text-orange-600 dark:hover:text-orange-300">
              首页
            </Link>
            <span>|</span>
            <Link href="/map" className="hover:text-orange-600 dark:hover:text-orange-300">
              地图探索
            </Link>
            <span>|</span>
            <Link href="/forum" className="hover:text-orange-600 dark:hover:text-orange-300">
              论坛
            </Link>
            <span>|</span>
            <Link href="/health" className="hover:text-orange-600 dark:hover:text-orange-300">
              健康饮食
            </Link>
          </nav>
          <p className="mt-2 text-xs text-orange-700/65 dark:text-orange-200/60">粤ICP备202604188号</p>
        </section>

        <section>
          <p className="text-xl font-bold text-orange-700 dark:text-orange-300">联系我们</p>
          <div className="mt-3 text-sm">
            <p className="font-semibold">华南运营中心</p>
            <p className="mt-1 text-orange-900/80 dark:text-orange-100/80">
              广东省广州市天河区大学城创新路 88 号
            </p>
            <p className="text-orange-900/80 dark:text-orange-100/80">
              CampusBite Campus Hub A座 10F
            </p>
          </div>
          <div className="mt-4 text-sm">
            <p className="font-semibold">华东协作中心</p>
            <p className="mt-1 text-orange-900/80 dark:text-orange-100/80">
              上海市杨浦区学林路 20 号创智空间 3F
            </p>
          </div>
        </section>

        <section>
          <p className="text-xl font-bold text-orange-700 dark:text-orange-300">关注我们</p>
          <p className="mt-2 text-sm text-orange-900/75 dark:text-orange-100/75">
            获取校园美食更新、活动通知和精选路线推荐
          </p>
          <div className="mt-3 flex items-center gap-2">
            {["微", "抖", "B", "小", "X"].map((label) => (
              <span
                key={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-300 bg-white text-xs font-bold text-orange-700 dark:border-orange-600 dark:bg-[#3a2318] dark:text-orange-200"
              >
                {label}
              </span>
            ))}
          </div>
        </section>
      </div>
    </footer>
  );
}

