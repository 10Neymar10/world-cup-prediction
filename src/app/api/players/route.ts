import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");

    const where: any = {};
    if (teamId) where.teamId = teamId;

    const players = await db.player.findMany({
      where,
      include: {
        team: {
          select: { id: true, name: true, flag: true, group: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ players });
  } catch (error) {
    console.error("Players API error:", error);
    return NextResponse.json({ error: "获取球员失败" }, { status: 500 });
  }
}
