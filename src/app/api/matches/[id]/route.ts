import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    const match = await db.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
        comments: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!match) {
      return NextResponse.json({ error: "比赛不存在" }, { status: 404 });
    }

    // Get user's prediction if logged in
    let userPrediction = null;
    if (session?.user?.id) {
      userPrediction = await db.prediction.findUnique({
        where: {
          userId_matchId: {
            userId: session.user.id,
            matchId: id,
          },
        },
      });
    }

    return NextResponse.json({ match, userPrediction });
  } catch (error) {
    console.error("Match detail API error:", error);
    return NextResponse.json({ error: "获取比赛详情失败" }, { status: 500 });
  }
}
