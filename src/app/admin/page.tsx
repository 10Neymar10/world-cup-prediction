"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Shield, Swords, Users, Save } from "lucide-react";

export default function AdminPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("matches");
  const [editingMatch, setEditingMatch] = useState<any>(null);

  const { data: matchesData, isLoading } = useQuery({
    queryKey: ["admin-matches"],
    queryFn: async () => {
      const res = await fetch("/api/admin/matches?limit=100");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/matches", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-matches"] });
      setEditingMatch(null);
      toast.success("比赛结果已更新，积分已自动计算");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const matches = matchesData?.matches || [];

  function handleUpdateResult(match: any) {
    updateMutation.mutate({
      matchId: match.id,
      homeScore: editingMatch.homeScore,
      awayScore: editingMatch.awayScore,
      status: "finished",
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8 text-[#FFD700]" />
          管理后台
        </h1>
        <Badge className="bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30">Admin</Badge>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v || "overall")} className="mb-8">
        <TabsList className="bg-[#1A1A2E] border-white/10">
          <TabsTrigger value="matches"><Swords className="mr-1 h-4 w-4" /> 比赛管理</TabsTrigger>
          <TabsTrigger value="users"><Users className="mr-1 h-4 w-4" /> 用户管理</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "matches" && (
        <div>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match: any) => (
                <Card key={match.id} className="border-white/10 bg-[#1A1A2E]">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xl">{match.homeTeam.flag}</span>
                        <span className="text-sm font-medium">{match.homeTeam.name}</span>
                        <span className="text-xs text-gray-500">VS</span>
                        <span className="text-xl">{match.awayTeam.flag}</span>
                        <span className="text-sm font-medium">{match.awayTeam.name}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {editingMatch?.id === match.id ? (
                          <>
                            <Input
                              type="number"
                              className="w-16 text-center bg-white/5 border-white/10"
                              value={editingMatch.homeScore}
                              onChange={(e) =>
                                setEditingMatch({ ...editingMatch, homeScore: parseInt(e.target.value) || 0 })
                              }
                            />
                            <span>-</span>
                            <Input
                              type="number"
                              className="w-16 text-center bg-white/5 border-white/10"
                              value={editingMatch.awayScore}
                              onChange={(e) =>
                                setEditingMatch({ ...editingMatch, awayScore: parseInt(e.target.value) || 0 })
                              }
                            />
                            <Button size="sm" className="bg-green-600" onClick={() => handleUpdateResult(match)}>
                              <Save className="mr-1 h-3 w-3" /> 保存
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingMatch(null)}>
                              取消
                            </Button>
                          </>
                        ) : (
                          <>
                            {match.status === "finished" ? (
                              <span className="font-bold tabular-nums">
                                {match.homeScore} - {match.awayScore}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                {new Date(match.matchTime).toLocaleString("zh-CN")}
                              </span>
                            )}
                            <Badge
                              className={
                                match.status === "finished"
                                  ? "bg-green-500/20 text-green-400"
                                  : match.status === "live"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-gray-500/20 text-gray-400"
                              }
                            >
                              {match.status}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {match._count?.predictions || 0} 预测
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/10"
                              onClick={() =>
                                setEditingMatch({
                                  id: match.id,
                                  homeScore: match.homeScore || 0,
                                  awayScore: match.awayScore || 0,
                                })
                              }
                            >
                              {match.status === "finished" ? "修改" : "录入比分"}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "users" && (
        <Card className="border-white/10 bg-[#1A1A2E]">
          <CardContent className="p-8 text-center text-gray-500">
            <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>用户管理功能将在后续版本中完善</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
