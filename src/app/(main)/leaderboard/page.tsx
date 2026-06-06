"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

const levelBadges: Record<string, { emoji: string; color: string }> = {
  rookie: { emoji: "🏅", color: "text-gray-400" },
  fan: { emoji: "⭐", color: "text-blue-400" },
  expert: { emoji: "🔥", color: "text-orange-400" },
  legend: { emoji: "👑", color: "text-[#FFD700]" },
};

export default function LeaderboardPage() {
  const [tab, setTab] = useState("overall");

  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await fetch("/api/leaderboard?limit=50");
      return res.json();
    },
  });

  const leaderboard = data?.leaderboard || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Trophy className="h-8 w-8 text-[#FFD700]" />
          排行榜
        </h1>
        <p className="text-gray-400">全球预测高手排名</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v || "overall")} className="mb-8">
        <TabsList className="bg-[#1A1A2E] border-white/10">
          <TabsTrigger value="overall">总排行榜</TabsTrigger>
          <TabsTrigger value="group">小组赛阶段</TabsTrigger>
          <TabsTrigger value="knockout">淘汰赛阶段</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-16">
          <Trophy className="mx-auto h-16 w-16 text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">暂无排名数据</h3>
          <p className="text-gray-500">比赛开始后，排行榜将实时更新</p>
        </div>
      ) : (
        <Card className="border-white/10 bg-[#1A1A2E] overflow-hidden">
          <CardContent className="p-0">
            {/* Top 3 Podium */}
            <div className="bg-gradient-to-r from-[#C8102E]/20 via-[#1A1A2E] to-[#FFD700]/20 p-6">
              <div className="flex items-end justify-center gap-4">
                {/* 2nd */}
                {leaderboard[1] && (
                  <div className="text-center">
                    <Avatar className="h-14 w-14 mx-auto mb-2 border-2 border-gray-300">
                      <AvatarImage src={leaderboard[1].avatar || ""} />
                      <AvatarFallback className="bg-gray-500">
                        {leaderboard[1].name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">{leaderboard[1].name}</p>
                    <p className="text-lg font-bold text-gray-300">{leaderboard[1].totalPoints}</p>
                    <span className="text-3xl">🥈</span>
                  </div>
                )}
                {/* 1st */}
                {leaderboard[0] && (
                  <div className="text-center -mt-4">
                    <Avatar className="h-18 w-18 mx-auto mb-2 border-3 border-[#FFD700]">
                      <AvatarImage src={leaderboard[0].avatar || ""} />
                      <AvatarFallback className="bg-[#C8102E] text-xl">
                        {leaderboard[0].name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-base font-bold">{leaderboard[0].name}</p>
                    <p className="text-2xl font-bold text-[#FFD700]">{leaderboard[0].totalPoints}</p>
                    <span className="text-4xl">👑</span>
                  </div>
                )}
                {/* 3rd */}
                {leaderboard[2] && (
                  <div className="text-center">
                    <Avatar className="h-14 w-14 mx-auto mb-2 border-2 border-amber-600">
                      <AvatarImage src={leaderboard[2].avatar || ""} />
                      <AvatarFallback className="bg-amber-700">
                        {leaderboard[2].name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">{leaderboard[2].name}</p>
                    <p className="text-lg font-bold text-amber-600">{leaderboard[2].totalPoints}</p>
                    <span className="text-3xl">🥉</span>
                  </div>
                )}
              </div>
            </div>

            {/* Rank List */}
            <div className="divide-y divide-white/5">
              {leaderboard.map((entry: any, idx: number) => {
                const badge = levelBadges[entry.level] || levelBadges.rookie;
                return (
                  <div
                    key={entry.userId}
                    className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-colors animate-rank-rise ${
                      idx < 3 ? "bg-white/[0.02]" : ""
                    }`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <span className="w-8 text-center font-bold text-lg tabular-nums">
                      {idx + 1}
                    </span>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={entry.avatar || ""} />
                      <AvatarFallback className="bg-[#C8102E]">
                        {entry.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate flex items-center gap-1">
                        {entry.name}
                        <span className={badge.color}>{badge.emoji}</span>
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>命中比分: {entry.exactScoreHits}次</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#FFD700] tabular-nums">
                        {entry.totalPoints}
                      </p>
                      <p className="text-xs text-gray-500">分</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
