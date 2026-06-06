import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const team = await db.team.findUnique({
      where: { id },
      include: {
        players: {
          orderBy: { number: "asc" },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "球队不存在" }, { status: 404 });
    }

    return NextResponse.json({ team });
  } catch (error) {
    console.error("Team detail API error:", error);
    return NextResponse.json({ error: "获取球队详情失败" }, { status: 500 });
  }
}
