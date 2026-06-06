import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { predictionSchema } from "@/lib/validators/prediction";
import { isBeforeDeadline } from "@/lib/scoring";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const predictions = await db.prediction.findMany({
      where: { userId: session.user.id },
      include: {
        match: {
          include: {
            homeTeam: { select: { id: true, name: true, flag: true } },
            awayTeam: { select: { id: true, name: true, flag: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ predictions });
  } catch (error) {
    console.error("Predictions API error:", error);
    return NextResponse.json({ error: "获取预测失败" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = predictionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "输入无效" },
        { status: 400 }
      );
    }

    const { matchId, homeScore, awayScore, predictedWinner, visibility } = parsed.data;

    // Check match exists and is not finished
    const match = await db.match.findUnique({ where: { id: matchId } });
    if (!match) {
      return NextResponse.json({ error: "比赛不存在" }, { status: 404 });
    }
    if (match.status === "finished" || match.status === "cancelled") {
      return NextResponse.json({ error: "比赛已结束或取消，无法预测" }, { status: 400 });
    }

    // Check deadline
    if (!isBeforeDeadline(match.matchTime)) {
      return NextResponse.json({ error: "预测已截止（比赛开球前 5 分钟截止）" }, { status: 400 });
    }

    // Upsert prediction
    const prediction = await db.prediction.upsert({
      where: {
        userId_matchId: {
          userId: session.user.id,
          matchId,
        },
      },
      create: {
        userId: session.user.id,
        matchId,
        homeScore,
        awayScore,
        predictedWinner,
        visibility,
      },
      update: {
        homeScore,
        awayScore,
        predictedWinner,
        visibility,
      },
    });

    return NextResponse.json({ prediction }, { status: 200 });
  } catch (error) {
    console.error("Create prediction error:", error);
    return NextResponse.json({ error: "提交预测失败" }, { status: 500 });
  }
}
