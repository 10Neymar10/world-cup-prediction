"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F1A] px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🟥</div>
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-[#C8102E] to-[#FFD700] bg-clip-text text-transparent">
          500
        </h1>
        <h2 className="text-xl font-semibold mb-2">红牌罚下！</h2>
        <p className="text-gray-400 mb-8">
          服务器出错了。这不是你的问题，就像一张意外的红牌。
          我们的技术团队正在紧急处理中。
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={reset} className="inline-flex items-center justify-center rounded-lg bg-[#C8102E] px-4 py-2 text-sm font-medium text-white hover:bg-[#a00d24] transition-colors">
            重新尝试
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
            回到首页
          </a>
        </div>
      </div>
    </div>
  );
}
