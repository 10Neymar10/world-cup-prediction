import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stage = searchParams.get("stage");
    const group = searchParams.get("group");
    const status = searchParams.get("status");
    const date = searchParams.get("date");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const page = parseInt(searchParams.get("page") || "1");
    const offset = (page - 1) * limit;

    const where: any = {};

    if (stage) where.stage = stage;
    if (group) where.group = group;
    if (status) where.status = status;

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      where.matchTime = { gte: startDate, lt: endDate };
    }

    const [matches, total] = await Promise.all([
      db.match.findMany({
        where,
        include: {
          homeTeam: {
            select: { id: true, name: true, nameEn: true, flag: true, group: true },
          },
          awayTeam: {
            select: { id: true, name: true, nameEn: true, flag: true, group: true },
          },
        },
        orderBy: { matchTime: "asc" },
        skip: offset,
        take: limit,
      }),
      db.match.count({ where }),
    ]);

    return NextResponse.json({
      matches,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Matches API error:", error);
    return NextResponse.json(
      { error: "获取赛程失败" },
      { status: 500 }
    );
  }
}
