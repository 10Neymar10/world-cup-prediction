import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stage = searchParams.get("stage"); // filter by match stage
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

    const users = await db.user.findMany({
      where: { role: "user" },
      select: {
        id: true,
        name: true,
        avatar: true,
        level: true,
        totalPoints: true,
        championPrediction: { select: { id: true } },
        predictions: {
          select: {
            pointsAwarded: true,
            homeScore: true,
            awayScore: true,
            createdAt: true,
            match: {
              select: {
                homeScore: true,
                awayScore: true,
                stage: true,
              },
            },
          },
        },
      },
    });

    // Calculate tiebreaker stats for each user
    const leaderboard = users
      .map((user) => {
        const finishedPreds = user.predictions.filter(
          (p) => p.match.homeScore != null
        );
        const exactScoreHits = finishedPreds.filter(
          (p) =>
            p.pointsAwarded >= 5 && // either group exact (5) or knockout exact (8)
            p.homeScore === p.match.homeScore &&
            p.awayScore === p.match.awayScore
        ).length;
        const championHits = user.championPrediction ? 0 : 0; // Will be computed when champion is known

        // Total prediction time (earlier = better for tiebreaker)
        const totalPredictionTime = user.predictions.reduce(
          (sum, p) => sum + p.createdAt.getTime(),
          0
        );

        return {
          userId: user.id,
          name: user.name,
          avatar: user.avatar,
          level: user.level,
          totalPoints: user.totalPoints,
          championHits,
          exactScoreHits,
          totalPredictionTime,
        };
      })
      .sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
        if (b.championHits !== a.championHits) return b.championHits - a.championHits;
        if (b.exactScoreHits !== a.exactScoreHits) return b.exactScoreHits - a.exactScoreHits;
        return a.totalPredictionTime - b.totalPredictionTime;
      })
      .slice(0, limit);

    // Add rank
    const ranked = leaderboard.map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
      rankChange: 0, // Would need historical data for real change
    }));

    return NextResponse.json({ leaderboard: ranked });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json({ error: "获取排行榜失败" }, { status: 500 });
  }
}
