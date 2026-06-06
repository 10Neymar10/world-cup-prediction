import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F1A] px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">⚽</div>
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-[#C8102E] to-[#FFD700] bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-xl font-semibold mb-2">球出界了！</h2>
        <p className="text-gray-400 mb-8">
          这个页面不存在，就像踢飞的球飞出了场外。
          让我们回到球场继续比赛吧。
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="inline-flex items-center justify-center rounded-lg bg-[#C8102E] px-4 py-2 text-sm font-medium text-white hover:bg-[#a00d24] transition-colors">
            回到首页
          </Link>
          <Link href="/matches" className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
            查看赛程
          </Link>
        </div>
      </div>
    </div>
  );
}
