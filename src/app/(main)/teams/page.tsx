"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

export default function TeamsPage() {
  const [selectedGroup, setSelectedGroup] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["teams", selectedGroup],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedGroup !== "all") params.set("group", selectedGroup);
      const res = await fetch(`/api/teams?${params}`);
      return res.json();
    },
  });

  const teams = data?.teams || [];

  // Group teams by group
  const grouped: Record<string, typeof teams> = {};
  for (const team of teams) {
    if (!grouped[team.group]) grouped[team.group] = [];
    grouped[team.group].push(team);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Users className="h-8 w-8 text-[#FFD700]" />
          球队
        </h1>
        <p className="text-gray-400">48 支参赛球队</p>
      </div>

      <Tabs value={selectedGroup} onValueChange={(v) => setSelectedGroup(v || "A")} className="mb-8">
        <TabsList className="bg-[#1A1A2E] border-white/10 flex flex-wrap h-auto gap-1">
          <TabsTrigger value="all">全部</TabsTrigger>
          {"ABCDEFGHIJKL".split("").map((g) => (
            <TabsTrigger key={g} value={g}>{g} 组</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([group, groupTeams]) => (
            <div key={group}>
              <h2 className="text-xl font-bold mb-4 text-[#FFD700]">{group} 组</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {groupTeams.map((team: any) => (
                  <Link key={team.id} href={`/teams/${team.id}`}>
                    <Card className="glass-card hover:border-[#FFD700]/30 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <span className="text-4xl mb-2 block">{team.flag || "⚽"}</span>
                        <p className="font-semibold">{team.name}</p>
                        <p className="text-xs text-gray-500">{team.flag || "⚽"}</p>
                        {team.fifaRank && (
                          <p className="text-xs text-gray-400 mt-1">
                            FIFA #{team.fifaRank}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
