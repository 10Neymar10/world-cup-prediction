"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Users, Swords } from "lucide-react";

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["team", id],
    queryFn: async () => {
      const res = await fetch(`/api/teams/${id}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
  });

  const team = data?.team;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="h-48 rounded-xl mb-8" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">球队不存在</h1>
        <Link href="/teams" className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
          <ChevronLeft className="mr-1" /> 返回球队列表
        </Link>
      </div>
    );
  }

  const positionLabels: Record<string, string> = {
    forward: "前锋",
    midfielder: "中场",
    defender: "后卫",
    goalkeeper: "门将",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/teams" className="inline-flex items-center rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors mb-4">
        <ChevronLeft className="mr-1 h-4 w-4" /> 返回球队列表
      </Link>

      {/* Team Info */}
      <Card className="border-white/10 bg-[#1A1A2E] mb-8">
        <CardContent className="p-8 text-center">
          <span className="text-6xl mb-4 block">{team.flag || "⚽"}</span>
          <h1 className="text-3xl font-bold mb-1">{team.name}</h1>
          <p className="text-gray-400 mb-4">{team.nameEn}</p>
          <div className="flex items-center justify-center gap-3">
            <Badge className="bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30">
              {team.group} 组
            </Badge>
            {team.fifaRank && (
              <Badge variant="outline" className="border-gray-600 text-gray-400">
                FIFA 排名 #{team.fifaRank}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Players */}
      <Card className="border-white/10 bg-[#1A1A2E]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#FFD700]" />
            球员名单
          </CardTitle>
        </CardHeader>
        <CardContent>
          {team.players?.length === 0 ? (
            <p className="text-center text-gray-500 py-8">暂无球员数据</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {team.players?.map((player: any) => (
                <div
                  key={player.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm font-mono text-gray-500 w-6">
                    {player.number || "-"}
                  </span>
                  <span className="text-sm">{player.name}</span>
                  {player.position && (
                    <span className="text-xs text-gray-500 ml-auto">
                      {positionLabels[player.position] || player.position}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
