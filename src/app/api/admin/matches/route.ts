import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { matchResultSchema } from "@/lib/validators/prediction";
import { calculateMatchPoints } from "@/lib/scoring";

// List all matches for admin
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || role !== "admin") {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

    const [matches, total] = await Promise.all([
      db.match.findMany({
        include: {
          homeTeam: { select: { id: true, name: true, flag: true } },
          awayTeam: { select: { id: true, name: true, flag: true } },
          _count: { select: { predictions: true } },
        },
        orderBy: { matchTime: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.match.count(),
    ]);

    return NextResponse.json({
      matches,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

// Update match result
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || role !== "admin") {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const body = await req.json();
    const { matchId, ...updateData } = body;
    const parsed = matchResultSchema.safeParse(updateData);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "输入无效" },
        { status: 400 }
      );
    }

    const match = await db.match.update({
      where: { id: matchId },
      data: {
        homeScore: parsed.data.homeScore,
        awayScore: parsed.data.awayScore,
        status: parsed.data.status,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    // If match is finished, calculate points for all predictions
    if (parsed.data.status === "finished") {
      const predictions = await db.prediction.findMany({
        where: { matchId },
        include: { user: true },
      });

      for (const pred of predictions) {
        const points = calculateMatchPoints(
          {
            homeScore: pred.homeScore,
            awayScore: pred.awayScore,
            predictedWinner: pred.predictedWinner,
          },
          {
            homeScore: parsed.data.homeScore,
            awayScore: parsed.data.awayScore,
            stage: match.stage,
            homeTeamId: match.homeTeamId,
            awayTeamId: match.awayTeamId,
          }
        );

        // Update prediction points
        await db.prediction.update({
          where: { id: pred.id },
          data: { pointsAwarded: points },
        });

        // Update user total points
        if (points > 0) {
          await db.user.update({
            where: { id: pred.userId },
            data: { totalPoints: { increment: points } },
          });
        }
      }
    }

    return NextResponse.json({ match });
  } catch (error) {
    console.error("Admin match update error:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
