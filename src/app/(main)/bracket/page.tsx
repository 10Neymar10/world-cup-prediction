"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Swords } from "lucide-react";

export default function BracketPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["matches", "knockout"],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("stage", "round32,round16,quarter,semi,third,final");
      const res = await fetch(`/api/matches?${params}&limit=50`);
      return res.json();
    },
  });

  const matches = data?.matches || [];

  const stageLabels: Record<string, string> = {
    round32: "32强",
    round16: "16强",
    quarter: "8强",
    semi: "半决赛",
    third: "季军赛",
    final: "决赛",
  };

  // Group by stage
  const byStage: Record<string, any[]> = {};
  for (const m of matches) {
    if (!byStage[m.stage]) byStage[m.stage] = [];
    byStage[m.stage].push(m);
  }

  const stageOrder = ["round32", "round16", "quarter", "semi", "third", "final"];
  const stageColumns = stageOrder.filter((s) => byStage[s]?.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Swords className="h-8 w-8 text-[#FFD700]" />
          淘汰赛对阵图
        </h1>
        <p className="text-gray-400">小组赛后对阵将实时更新</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : stageColumns.length === 0 ? (
        <Card className="border-white/10 bg-[#1A1A2E]">
          <CardContent className="p-16 text-center">
            <Swords className="mx-auto h-16 w-16 text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">对阵图尚未生成</h2>
            <p className="text-gray-500">小组赛结束后，淘汰赛对阵将根据小组排名自动生成</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4" style={{ minWidth: stageColumns.length * 200 }}>
            {stageColumns.map((stage) => (
              <div key={stage} className="flex-1 min-w-[180px]">
                <h3 className="text-sm font-semibold text-[#FFD700] mb-3 text-center">
                  {stageLabels[stage]}
                </h3>
                <div className="space-y-3">
                  {byStage[stage].map((match: any, idx: number) => (
                    <Card key={match.id} className="border-white/10 bg-[#1A1A2E] text-xs">
                      <CardContent className="p-2">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1 flex-1">
                            <span className="text-sm">{match.homeTeam.flag}</span>
                            <span className="truncate">{match.homeTeam.name}</span>
                          </div>
                          {match.status === "finished" ? (
                            <span className="font-bold mx-1 tabular-nums">
                              {match.homeScore}-{match.awayScore}
                            </span>
                          ) : (
                            <span className="text-gray-500 mx-1">VS</span>
                          )}
                          <div className="flex items-center gap-1 flex-1 justify-end">
                            <span className="truncate">{match.awayTeam.name}</span>
                            <span className="text-sm">{match.awayTeam.flag}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
