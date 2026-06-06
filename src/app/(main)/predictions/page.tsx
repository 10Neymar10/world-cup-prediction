"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Swords, Lock, Trophy } from "lucide-react";
import { useState } from "react";

export default function PredictionsPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["my-predictions"],
    queryFn: async () => {
      const res = await fetch("/api/predictions");
      return res.json();
    },
    enabled: !!session,
  });

  const predictions = data?.predictions || [];

  const stageLabels: Record<string, string> = {
    group: "小组赛",
    round32: "32强",
    round16: "16强",
    quarter: "8强",
    semi: "半决赛",
    third: "季军赛",
    final: "决赛",
  };

  const filtered = tab === "all"
    ? predictions
    : predictions.filter((p: any) => p.match.stage === tab);

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Lock className="mx-auto h-16 w-16 text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold mb-4">请先登录</h1>
        <Link href="/auth/login" className="inline-flex items-center justify-center rounded-lg bg-[#C8102E] px-4 py-2 text-sm font-medium text-white hover:bg-[#a00d24] transition-colors">
          登录
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Swords className="h-8 w-8 text-[#FFD700]" />
          我的预测
        </h1>
        <p className="text-gray-400">管理你提交的所有预测</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v || "overall")} className="mb-8">
        <TabsList className="bg-[#1A1A2E] border-white/10">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="group">小组赛</TabsTrigger>
          <TabsTrigger value="round32">32强</TabsTrigger>
          <TabsTrigger value="round16">16强</TabsTrigger>
          <TabsTrigger value="quarter">8强+</TabsTrigger>
          <TabsTrigger value="final">决赛</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Trophy className="mx-auto h-16 w-16 text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">暂无预测</h3>
          <p className="text-gray-500 mb-4">去赛程页面开始你的第一次预测吧！</p>
          <Link href="/matches" className="inline-flex items-center justify-center rounded-lg bg-[#C8102E] px-4 py-2 text-sm font-medium text-white hover:bg-[#a00d24] transition-colors">
            查看赛程
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((pred: any) => (
            <Link key={pred.id} href={`/matches/${pred.matchId}`}>
              <Card className="glass-card hover:border-[#FFD700]/30 transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Badge variant="outline" className="border-gray-600 text-gray-400">
                        {stageLabels[pred.match.stage] || pred.match.stage}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{pred.match.homeTeam.flag}</span>
                        <span className="text-sm">{pred.match.homeTeam.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">VS</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{pred.match.awayTeam.name}</span>
                        <span className="text-xl">{pred.match.awayTeam.flag}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold tabular-nums">
                          {pred.homeScore} - {pred.awayScore}
                        </p>
                        <p className="text-xs text-gray-500">你的预测</p>
                      </div>
                      <Badge className={
                        pred.pointsAwarded > 0
                          ? "bg-green-500/20 text-green-400"
                          : pred.match.status === "finished"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-gray-500/20 text-gray-400"
                      }>
                        {pred.match.status === "finished"
                          ? `${pred.pointsAwarded} 分`
                          : "待定"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
