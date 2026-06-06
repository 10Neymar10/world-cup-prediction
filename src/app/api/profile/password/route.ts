import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { changePasswordSchema } from "@/lib/validators/prediction";

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "输入无效" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "该账号未设置密码（请使用社交账号登录后绑定密码）" },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(
      parsed.data.currentPassword,
      user.passwordHash
    );

    if (!isValid) {
      return NextResponse.json({ error: "当前密码错误" }, { status: 400 });
    }

    const newHash = await bcrypt.hash(parsed.data.newPassword, 12);

    await db.user.update({
      where: { id: session.user.id },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json({ error: "修改密码失败" }, { status: 500 });
  }
}
