"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Swords, Filter } from "lucide-react";

const stageOptions = [
  { value: "all", label: "全部阶段" },
  { value: "group", label: "小组赛" },
  { value: "round32", label: "32强" },
  { value: "round16", label: "16强" },
  { value: "quarter", label: "8强" },
  { value: "semi", label: "半决赛" },
  { value: "third", label: "季军赛" },
  { value: "final", label: "决赛" },
];

const groupOptions = [
  { value: "all", label: "全部小组" },
  ..."ABCDEFGHIJKL".split("").map((g) => ({ value: g, label: `${g} 组` })),
];

const statusOptions = [
  { value: "all", label: "全部状态" },
  { value: "scheduled", label: "即将开始" },
  { value: "live", label: "进行中" },
  { value: "finished", label: "已结束" },
];

export default function MatchesPage() {
  const [stage, setStage] = useState("all");
  const [group, setGroup] = useState("all");
  const [status, setStatus] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["matches", stage, group, status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (stage !== "all") params.set("stage", stage);
      if (group !== "all") params.set("group", group);
      if (status !== "all") params.set("status", status);
      params.set("limit", "100");
      const res = await fetch(`/api/matches?${params}`);
      return res.json();
    },
  });

  const stageLabels: Record<string, string> = {
    group: "小组赛",
    round32: "32强",
    round16: "16强",
    quarter: "8强",
    semi: "半决赛",
    third: "季军赛",
    final: "决赛",
  };

  const matches = data?.matches || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Swords className="h-8 w-8 text-[#FFD700]" />
          赛程
        </h1>
        <p className="text-gray-400">查看 2026 世界杯全部 104 场比赛</p>
      </div>

      {/* Filters */}
      <Card className="border-white/10 bg-[#1A1A2E] mb-8">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={stage} onValueChange={(v) => setStage(v || "all")}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {stageOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={group} onValueChange={(v) => setGroup(v || "all")}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {groupOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(v) => setStatus(v || "all")}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Match List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-16">
          <Swords className="mx-auto h-16 w-16 text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">暂无比赛</h3>
          <p className="text-gray-500">当前筛选条件下没有比赛数据</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match: any) => (
            <Link key={match.id} href={`/matches/${match.id}`}>
              <Card className="glass-card hover:border-[#FFD700]/30 transition-all duration-300 hover:scale-[1.005] cursor-pointer">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Stage & Group Info */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="border-gray-600 text-gray-400">
                        {stageLabels[match.stage]}
                      </Badge>
                      {match.group && (
                        <Badge className="bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30">
                          {match.group} 组
                        </Badge>
                      )}
                    </div>

                    {/* Match Content */}
                    <div className="flex-1 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <span className="text-right">
                          <p className="font-semibold">{match.homeTeam.name}</p>
                          <p className="text-xs text-gray-500">{match.homeTeam.nameEn}</p>
                        </span>
                        <span className="text-3xl">{match.homeTeam.flag || "⚽"}</span>
                      </div>

                      <div className="flex flex-col items-center shrink-0">
                        {match.status === "finished" ? (
                          <span className="text-2xl font-bold tabular-nums">
                            {match.homeScore} - {match.awayScore}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">
                            {new Date(match.matchTime).toLocaleDateString("zh-CN", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(match.matchTime).toLocaleTimeString("zh-CN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-3xl">{match.awayTeam.flag || "⚽"}</span>
                        <span>
                          <p className="font-semibold">{match.awayTeam.name}</p>
                          <p className="text-xs text-gray-500">{match.awayTeam.nameEn}</p>
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="shrink-0">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
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
                          ? "✓ 已结束"
                          : "即将开始"}
                      </span>
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
