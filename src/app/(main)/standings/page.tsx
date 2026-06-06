"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy } from "lucide-react";

export default function StandingsPage() {
  const [selectedGroup, setSelectedGroup] = useState("A");

  const { data, isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await fetch("/api/teams");
      return res.json();
    },
  });

  const teams = data?.teams || [];

  // For now, show placeholder standings since we need match results
  // In production, this would calculate from actual match data
  const grouped: Record<string, typeof teams> = {};
  for (const team of teams) {
    if (!grouped[team.group]) grouped[team.group] = [];
    grouped[team.group].push(team);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Trophy className="h-8 w-8 text-[#FFD700]" />
          小组积分榜
        </h1>
        <p className="text-gray-400">12 个小组实时排名</p>
      </div>

      <Tabs value={selectedGroup} onValueChange={(v) => setSelectedGroup(v || "A")} className="mb-8">
        <TabsList className="bg-[#1A1A2E] border-white/10 flex flex-wrap h-auto gap-1">
          {"ABCDEFGHIJKL".split("").map((g) => (
            <TabsTrigger key={g} value={g}>{g} 组</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : (
        <Card className="border-white/10 bg-[#1A1A2E]">
          <CardHeader>
            <CardTitle className="text-lg">{selectedGroup} 组</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="text-left p-3 w-10">#</th>
                    <th className="text-left p-3">球队</th>
                    <th className="text-center p-3">赛</th>
                    <th className="text-center p-3">胜</th>
                    <th className="text-center p-3">平</th>
                    <th className="text-center p-3">负</th>
                    <th className="text-center p-3">进/失</th>
                    <th className="text-center p-3">净胜</th>
                    <th className="text-center p-3 font-bold">分</th>
                  </tr>
                </thead>
                <tbody>
                  {(grouped[selectedGroup] || []).map((team: any, idx: number) => (
                    <tr
                      key={team.id}
                      className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                        idx < 2 ? "group-qualified" : idx === 2 ? "group-pending" : "group-eliminated"
                      }`}
                    >
                      <td className="p-3 text-gray-500">{idx + 1}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{team.flag || "⚽"}</span>
                          <div>
                            <p className="font-medium">{team.name}</p>
                            <p className="text-xs text-gray-500">{team.flag || "⚽"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-3">0</td>
                      <td className="text-center p-3">0</td>
                      <td className="text-center p-3">0</td>
                      <td className="text-center p-3">0</td>
                      <td className="text-center p-3 text-gray-500">0:0</td>
                      <td className="text-center p-3">0</td>
                      <td className="text-center p-3 font-bold text-[#FFD700]">0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
