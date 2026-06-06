import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0F0F1A]/80 backdrop-blur-xl mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <span>⚽</span>
              <span className="bg-gradient-to-r from-[#C8102E] to-[#FFD700] bg-clip-text text-transparent">
                2026 世界杯预测
              </span>
            </h3>
            <p className="text-sm text-gray-400">
              与全球球迷一起预测 2026 美加墨世界杯
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-[#FFD700]">快速链接</h4>
            <nav className="flex flex-col gap-1">
              <Link href="/matches" className="text-sm text-gray-400 hover:text-white transition-colors">赛程</Link>
              <Link href="/leaderboard" className="text-sm text-gray-400 hover:text-white transition-colors">排行榜</Link>
              <Link href="/teams" className="text-sm text-gray-400 hover:text-white transition-colors">球队</Link>
              <Link href="/players" className="text-sm text-gray-400 hover:text-white transition-colors">球员</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-[#FFD700]">关于</h4>
            <p className="text-sm text-gray-400">
              本站为 2026 美加墨世界杯预测社区，仅供娱乐参考。
              比赛数据以 FIFA 官方公布为准。
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-white/10 text-center text-sm text-gray-500">
          © 2026 World Cup Predictions. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
