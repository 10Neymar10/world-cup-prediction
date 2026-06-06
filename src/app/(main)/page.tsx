import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Swords, ArrowRight, Flame } from "lucide-react";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C8102E]/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.1),transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#FFD700] via-white to-[#C8102E] bg-clip-text text-transparent">
              2026 世界杯
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-2">
            美加墨世界杯预测平台
          </p>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            预测每场比赛的比分，争夺积分排名，与全球球迷一起见证冠军诞生！
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/matches" className="inline-flex items-center justify-center rounded-lg bg-[#C8102E] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#a00d24] transition-colors">
              <Swords className="mr-2 h-5 w-5" /> 查看赛程
            </Link>
            <Link href="/leaderboard" className="inline-flex items-center justify-center rounded-lg border border-[#FFD700] px-4 py-2.5 text-sm font-medium text-[#FFD700] hover:bg-[#FFD700]/10 transition-colors">
              <Trophy className="mr-2 h-5 w-5" /> 排行榜
            </Link>
          </div>
        </div>
      </section>

      {/* Today's Matches */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <Suspense fallback={<MatchListSkeleton />}>
          <TodayMatches />
        </Suspense>
      </section>

      {/* Leaderboard Snapshot + Hot Matches */}
      <section className="mx-auto max-w-7xl px-4 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Suspense fallback={<Skeleton className="h-64 rounded-xl" />}>
          <LeaderboardSnapshot />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-64 rounded-xl" />}>
          <FeaturedMatches />
        </Suspense>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <Card className="border-[#FFD700]/20 bg-gradient-to-r from-[#1A1A2E] to-[#0F0F1A]">
          <CardContent className="py-12 text-center">
            <Flame className="mx-auto h-12 w-12 text-[#C8102E] mb-4" />
            <h2 className="text-2xl font-bold mb-2">准备好开始预测了吗？</h2>
            <p className="text-gray-400 mb-6">
              加入数千名球迷，用你的足球知识争夺排行榜冠军！
            </p>
            <Link href="/auth/register" className="inline-flex items-center justify-center rounded-lg bg-[#C8102E] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#a00d24] transition-colors">
              立即加入 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

async function TodayMatches() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  const matches = await db.match.findMany({
    where: {
      matchTime: { gte: startOfDay, lt: endOfDay },
    },
    include: {
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: { matchTime: "asc" },
    take: 8,
  });

  if (matches.length === 0) {
    // Show upcoming matches instead
    const upcoming = await db.match.findMany({
      where: { matchTime: { gte: now } },
      include: { homeTeam: true, awayTeam: true },
      orderBy: { matchTime: "asc" },
      take: 8,
    });

    if (upcoming.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <Swords className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p className="text-lg">暂无比赛数据</p>
        </div>
      );
    }

    return <MatchGrid title="即将开始" matches={upcoming} />;
  }

  return <MatchGrid title="今日赛程" matches={matches} />;
}

function MatchGrid({
  title,
  matches,
}: {
  title: string;
  matches: any[];
}) {
  const stageLabels: Record<string, string> = {
    group: "小组赛",
    round32: "32强",
    round16: "16强",
    quarter: "8强",
    semi: "半决赛",
    third: "季军赛",
    final: "决赛",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Swords className="h-6 w-6 text-[#FFD700]" />
          {title}
        </h2>
        <Link href="/matches" className="inline-flex items-center rounded-lg px-2.5 py-1.5 text-sm font-medium text-[#FFD700] hover:bg-white/5 transition-colors">
          查看全部 <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {matches.map((match) => (
          <Link key={match.id} href={`/matches/${match.id}`}>
            <Card className="glass-card hover:border-[#FFD700]/30 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                    {stageLabels[match.stage] || match.stage}
                  </Badge>
                  {match.group && (
                    <Badge variant="outline" className="text-xs border-[#FFD700]/30 text-[#FFD700]">
                      {match.group} 组
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <span className="text-2xl">{match.homeTeam.flag || "⚽"}</span>
                    <span className="text-sm font-medium text-center">{match.homeTeam.name}</span>
                  </div>
                  <div className="flex flex-col items-center px-2">
                    <span className="text-xs text-gray-500">
                      {new Date(match.matchTime).toLocaleTimeString("zh-CN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-lg font-bold text-gray-400">VS</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <span className="text-2xl">{match.awayTeam.flag || "⚽"}</span>
                    <span className="text-sm font-medium text-center">{match.awayTeam.name}</span>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      match.status === "live"
                        ? "bg-red-500/20 text-red-400 animate-score-pulse"
                        : match.status === "finished"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {match.status === "live"
                      ? "● 进行中"
                      : match.status === "finished"
                      ? "已结束"
                      : "即将开始"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MatchListSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

async function LeaderboardSnapshot() {
  const topUsers = await db.user.findMany({
    where: { role: "user" },
    orderBy: { totalPoints: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      avatar: true,
      level: true,
      totalPoints: true,
    },
  });

  const levelLabels: Record<string, string> = {
    rookie: "🏅 新手",
    fan: "⭐ 球迷",
    expert: "🔥 专家",
    legend: "👑 传奇",
  };

  return (
    <Card className="border-white/10 bg-[#1A1A2E]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-[#FFD700]" />
          排行榜 Top 5
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topUsers.length === 0 ? (
          <p className="text-center text-gray-500 py-8">暂无排名数据</p>
        ) : (
          <div className="space-y-3">
            {topUsers.map((user, idx) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span className={`text-lg font-bold w-8 text-center ${
                  idx === 0 ? "text-[#FFD700]" : idx === 1 ? "text-gray-300" : idx === 2 ? "text-amber-600" : "text-gray-500"
                }`}>
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{levelLabels[user.level] || user.level}</p>
                </div>
                <span className="font-bold text-[#FFD700]">{user.totalPoints} 分</span>
              </div>
            ))}
          </div>
        )}
        <Link href="/leaderboard" className="inline-flex items-center justify-center w-full rounded-lg px-2.5 py-1.5 text-sm font-medium text-[#FFD700] hover:bg-white/5 transition-colors mt-4">
          查看完整排行榜 <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

async function FeaturedMatches() {
  const matches = await db.match.findMany({
    where: {
      status: "scheduled",
      stage: { in: ["semi", "final", "quarter"] },
    },
    include: {
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: { matchTime: "asc" },
    take: 4,
  });

  return (
    <Card className="border-white/10 bg-[#1A1A2E]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className="h-5 w-5 text-[#C8102E]" />
          焦点比赛
        </CardTitle>
      </CardHeader>
      <CardContent>
        {matches.length === 0 ? (
          <p className="text-center text-gray-500 py-8">暂无焦点比赛</p>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => (
              <Link
                key={match.id}
                href={`/matches/${match.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span>{match.homeTeam.flag || "⚽"}</span>
                  <span className="text-sm">{match.homeTeam.name}</span>
                </div>
                <span className="text-xs text-gray-500">VS</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm">{match.awayTeam.name}</span>
                  <span>{match.awayTeam.flag || "⚽"}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        <Button variant="ghost" size="sm" className="w-full mt-4 text-[#FFD700]">
          <Link href="/matches">
            查看全部赛程 <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
