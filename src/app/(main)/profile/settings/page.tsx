"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ChevronLeft, Lock, Shield } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "修改失败");
      } else {
        toast.success("密码已修改");
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch {
      toast.error("网络错误");
    }

    setLoading(false);
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <Lock className="mx-auto h-16 w-16 text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold mb-4">请先登录</h1>
        <Link href="/auth/login" className="inline-flex items-center justify-center rounded-lg bg-[#C8102E] px-4 py-2 text-sm font-medium text-white hover:bg-[#a00d24] transition-colors">
          登录
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/profile" className="inline-flex items-center rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors mb-4">
        <ChevronLeft className="mr-1 h-4 w-4" /> 返回个人中心
      </Link>

      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Shield className="h-8 w-8 text-[#FFD700]" />
        账号设置
      </h1>

      {/* Connected Accounts */}
      <Card className="border-white/10 bg-[#1A1A2E] mb-8">
        <CardHeader>
          <CardTitle>关联账号</CardTitle>
          <CardDescription className="text-gray-400">管理第三方登录方式</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Google</p>
              <p className="text-sm text-gray-400">使用 Google 账号登录</p>
            </div>
            <Button variant="outline" size="sm" className="border-white/10">绑定</Button>
          </div>
          <Separator className="bg-white/10" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">GitHub</p>
              <p className="text-sm text-gray-400">使用 GitHub 账号登录</p>
            </div>
            <Button variant="outline" size="sm" className="border-white/10">绑定</Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-white/10 bg-[#1A1A2E] mb-8">
        <CardHeader>
          <CardTitle>修改密码</CardTitle>
          <CardDescription className="text-gray-400">仅限邮箱注册用户</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label>当前密码</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-white/5 border-white/10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>新密码</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="至少 8 位，含大小写字母和数字"
                className="bg-white/5 border-white/10"
                required
                minLength={8}
              />
            </div>
            <Button
              type="submit"
              className="bg-[#C8102E] hover:bg-[#a00d24]"
              disabled={loading}
            >
              {loading ? "保存中..." : "修改密码"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
