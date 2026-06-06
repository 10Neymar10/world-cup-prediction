import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const group = searchParams.get("group");

    const where: any = {};
    if (group) where.group = group;

    const teams = await db.team.findMany({
      where,
      include: {
        players: {
          select: { id: true, name: true, position: true, number: true },
          orderBy: { number: "asc" },
        },
        _count: {
          select: {
            homeMatches: true,
            awayMatches: true,
          },
        },
      },
      orderBy: [{ group: "asc" }, { fifaRank: "asc" }],
    });

    return NextResponse.json({ teams });
  } catch (error) {
    console.error("Teams API error:", error);
    return NextResponse.json({ error: "获取球队失败" }, { status: 500 });
  }
}
