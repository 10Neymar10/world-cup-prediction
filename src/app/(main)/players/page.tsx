"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCircle, Star } from "lucide-react";

const positionLabels: Record<string, string> = {
  forward: "前锋",
  midfielder: "中场",
  defender: "后卫",
  goalkeeper: "门将",
};

export default function PlayersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["players"],
    queryFn: async () => {
      const res = await fetch("/api/players");
      return res.json();
    },
  });

  const players = data?.players || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <UserCircle className="h-8 w-8 text-[#FFD700]" />
          球员
        </h1>
        <p className="text-gray-400">金靴奖热门球员</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : players.length === 0 ? (
        <div className="text-center py-16">
          <UserCircle className="mx-auto h-16 w-16 text-gray-600 mb-4" />
          <p className="text-gray-500">暂无球员数据</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((player: any) => (
            <Card key={player.id} className="glass-card hover:border-[#FFD700]/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#C8102E]/20 flex items-center justify-center text-xl font-bold">
                    {player.number || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold flex items-center gap-1">
                      {player.name}
                      <Star className="h-3 w-3 text-[#FFD700]" />
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{player.team?.flag}</span>
                      <span>{player.team?.name}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-gray-600 text-gray-400 shrink-0">
                    {positionLabels[player.position || ""] || player.position || "未知"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
