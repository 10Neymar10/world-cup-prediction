"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trophy, Clock, MapPin, Users, Lock, Eye, EyeOff, Users2, ChevronLeft } from "lucide-react";

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [predictedWinner, setPredictedWinner] = useState<string | null>(null);
  const [visibility, setVisibility] = useState("public");

  const { data, isLoading } = useQuery({
    queryKey: ["match", id],
    queryFn: async () => {
      const res = await fetch(`/api/matches/${id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const match = data?.match;
  const userPrediction = data?.userPrediction;

  // Pre-fill form if user already predicted
  useEffect(() => {
    if (userPrediction) {
      setHomeScore(userPrediction.homeScore);
      setAwayScore(userPrediction.awayScore);
      setPredictedWinner(userPrediction.predictedWinner);
      setVisibility(userPrediction.visibility);
    }
  }, [userPrediction]);

  const predictionMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "提交失败");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match", id] });
      toast.success("预测提交成功！🎉");
      // Trigger confetti
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) {
      toast.error("请先登录");
      return;
    }

    predictionMutation.mutate({
      matchId: id,
      homeScore,
      awayScore,
      predictedWinner: match?.stage !== "group" ? predictedWinner || undefined : undefined,
      visibility,
    });
  }

  const isGroup = match?.stage === "group";
  const isBeforeDeadline = match ? new Date(match.matchTime).getTime() - 5 * 60 * 1000 > Date.now() : false;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="h-64 rounded-xl mb-8" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">比赛不存在</h1>
        <Link href="/matches" className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" /> 返回赛程
        </Link>
      </div>
    );
  }

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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/matches" className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors mb-4">
        <ChevronLeft className="mr-1 h-4 w-4" /> 返回赛程
      </Link>

      {/* Match Info */}
      <Card className="border-white/10 bg-gradient-to-b from-[#1A1A2E] to-[#0F0F1A] mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,16,46,0.1),transparent_70%)]" />
        <CardContent className="relative p-6 sm:p-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge className="bg-[#C8102E]/20 text-[#C8102E] border-[#C8102E]/30">
              {stageLabels[match.stage]}
            </Badge>
            {match.group && (
              <Badge className="bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30">
                {match.group} 组
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 sm:gap-8">
            <div className="flex flex-col items-center flex-1">
              <span className="text-5xl sm:text-6xl mb-3">{match.homeTeam.flag || "⚽"}</span>
              <h2 className="text-xl sm:text-2xl font-bold text-center">{match.homeTeam.name}</h2>
              <p className="text-sm text-gray-500">{match.homeTeam.nameEn}</p>
            </div>

            <div className="flex flex-col items-center shrink-0">
              {match.status === "finished" ? (
                <span className="text-4xl sm:text-5xl font-bold tabular-nums mb-2">
                  {match.homeScore} - {match.awayScore}
                </span>
              ) : (
                <span className="text-2xl sm:text-3xl font-bold text-gray-400 mb-2">VS</span>
              )}
              <span className="text-sm text-gray-400">
                <Clock className="inline h-3 w-3 mr-1" />
                {new Date(match.matchTime).toLocaleString("zh-CN", {
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span
                className={`text-xs mt-1 px-3 py-1 rounded-full ${
                  match.status === "live"
                    ? "bg-red-500/20 text-red-400 animate-score-pulse"
                    : match.status === "finished"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {match.status === "live" ? "● 进行中" : match.status === "finished" ? "✓ 已结束" : "即将开始"}
              </span>
            </div>

            <div className="flex flex-col items-center flex-1">
              <span className="text-5xl sm:text-6xl mb-3">{match.awayTeam.flag || "⚽"}</span>
              <h2 className="text-xl sm:text-2xl font-bold text-center">{match.awayTeam.name}</h2>
              <p className="text-sm text-gray-500">{match.awayTeam.nameEn}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prediction Form */}
      <Card className="border-white/10 bg-[#1A1A2E]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#FFD700]" />
            {userPrediction ? "修改预测" : "提交预测"}
          </CardTitle>
          {!isBeforeDeadline && match.status === "scheduled" && (
            <p className="text-sm text-red-400">⚠ 预测已截止（比赛开始前 5 分钟截止）</p>
          )}
          {match.status === "finished" && (
            <p className="text-sm text-gray-500">比赛已结束，无法提交预测</p>
          )}
          {userPrediction && match.status === "finished" && (
            <p className="text-sm text-[#FFD700]">
              本场得分：{userPrediction.pointsAwarded} 分
            </p>
          )}
        </CardHeader>
        <CardContent>
          {!session ? (
            <div className="text-center py-6">
              <Lock className="mx-auto h-8 w-8 text-gray-500 mb-2" />
              <p className="text-gray-400 mb-4">请先登录以提交预测</p>
              <Link href={`/auth/login?callbackUrl=/matches/${id}`} className="inline-flex items-center justify-center rounded-lg bg-[#C8102E] px-4 py-2 text-sm font-medium text-white hover:bg-[#a00d24] transition-colors">
                登录
              </Link>
            </div>
          ) : isBeforeDeadline || match.status !== "scheduled" ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-3 gap-4 items-end">
                <div className="space-y-2 text-center">
                  <Label>{match.homeTeam.name}</Label>
                  <Input
                    type="number"
                    min={0}
                    max={99}
                    value={homeScore}
                    onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
                    className="text-center text-2xl bg-white/5 border-white/10"
                    required
                  />
                </div>
                <div className="text-center pb-3">
                  <span className="text-2xl text-gray-500">-</span>
                </div>
                <div className="space-y-2 text-center">
                  <Label>{match.awayTeam.name}</Label>
                  <Input
                    type="number"
                    min={0}
                    max={99}
                    value={awayScore}
                    onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
                    className="text-center text-2xl bg-white/5 border-white/10"
                    required
                  />
                </div>
              </div>

              {!isGroup && (
                <div className="space-y-2">
                  <Label>预测胜者（含加时/点球）</Label>
                  <Select value={predictedWinner || ""} onValueChange={(v) => setPredictedWinner(v)}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="选择晋级球队" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={match.homeTeamId}>{match.homeTeam.name}</SelectItem>
                      <SelectItem value={match.awayTeamId}>{match.awayTeam.name}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>预测可见性</Label>
                <Select value={visibility} onValueChange={(v) => setVisibility(v || "public")}>
                  <SelectTrigger className="w-48 bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <span className="flex items-center gap-2"><Eye className="h-3 w-3" /> 公开</span>
                    </SelectItem>
                    <SelectItem value="friends_only">
                      <span className="flex items-center gap-2"><Users2 className="h-3 w-3" /> 仅好友可见</span>
                    </SelectItem>
                    <SelectItem value="private">
                      <span className="flex items-center gap-2"><EyeOff className="h-3 w-3" /> 私密</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#C8102E] hover:bg-[#a00d24]"
                disabled={predictionMutation.isPending || (!isGroup && !predictedWinner)}
              >
                {predictionMutation.isPending
                  ? "提交中..."
                  : userPrediction
                  ? "更新预测"
                  : "提交预测"}
              </Button>
            </form>
          ) : null}
        </CardContent>
      </Card>

      {/* Match Stats (for finished matches) */}
      {match.status === "finished" && match.homeScore != null && (
        <Card className="border-white/10 bg-[#1A1A2E] mt-8">
          <CardHeader>
            <CardTitle className="text-lg">比赛结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-center">
              <div className="flex-1">
                <p className="text-3xl font-bold">{match.homeScore}</p>
                <p className="text-sm text-gray-400">{match.homeTeam.name}</p>
              </div>
              <div className="text-gray-500 text-lg">-</div>
              <div className="flex-1">
                <p className="text-3xl font-bold">{match.awayScore}</p>
                <p className="text-sm text-gray-400">{match.awayTeam.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
