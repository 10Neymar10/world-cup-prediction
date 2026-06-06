"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { UserCircle, Settings, Trophy, Target, Lock } from "lucide-react";

const levelBadges: Record<string, { label: string; emoji: string }> = {
  rookie: { label: "新手", emoji: "🏅" },
  fan: { label: "球迷", emoji: "⭐" },
  expert: { label: "专家", emoji: "🔥" },
  legend: { label: "传奇", emoji: "👑" },
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile");
      return res.json();
    },
    enabled: !!session,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setEditing(false);
      toast.success("资料已更新");
    },
    onError: () => toast.error("更新失败"),
  });

  const user = data?.user;

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Lock className="mx-auto h-16 w-16 text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold mb-4">请先登录</h1>
        <Link href="/auth/login" className="inline-flex items-center justify-center rounded-lg bg-[#C8102E] px-4 py-2 text-sm font-medium text-white hover:bg-[#a00d24] transition-colors">
          登录
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="h-48 rounded-xl mb-8" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  const levelInfo = levelBadges[user?.level || "rookie"];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <UserCircle className="h-8 w-8 text-[#FFD700]" />
          个人中心
        </h1>
        <Link href="/profile/settings" className="inline-flex items-center rounded-lg border border-white/10 px-2.5 py-1.5 text-sm font-medium hover:bg-white/5 transition-colors">
          <Settings className="mr-2 h-4 w-4" /> 账号设置
        </Link>
      </div>

      {/* Profile Card */}
      <Card className="border-white/10 bg-[#1A1A2E] mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-20 w-20 border-2 border-[#FFD700]/30">
              <AvatarImage src={user?.avatar || ""} />
              <AvatarFallback className="bg-[#C8102E] text-2xl">
                {user?.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              {editing ? (
                <div className="space-y-3">
                  <div>
                    <Label>昵称</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div>
                    <Label>简介</Label>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="bg-white/5 border-white/10"
                      maxLength={200}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-[#C8102E]"
                      onClick={() => updateMutation.mutate({ name, bio })}
                      disabled={updateMutation.isPending}
                    >
                      保存
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/10"
                      onClick={() => setEditing(false)}
                    >
                      取消
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    {user?.name}
                    <span>{levelInfo?.emoji}</span>
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">{user?.bio || "这个人很懒，什么都没写..."}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge className="bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30">
                      {levelInfo?.label}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      加入于 {new Date(user?.createdAt).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-[#FFD700]"
                    onClick={() => {
                      setName(user?.name || "");
                      setBio(user?.bio || "");
                      setEditing(true);
                    }}
                  >
                    编辑资料
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-white/10 bg-[#1A1A2E]">
          <CardContent className="p-4 text-center">
            <Trophy className="mx-auto h-6 w-6 text-[#FFD700] mb-2" />
            <p className="text-2xl font-bold">{user?.totalPoints || 0}</p>
            <p className="text-xs text-gray-400">总积分</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#1A1A2E]">
          <CardContent className="p-4 text-center">
            <Target className="mx-auto h-6 w-6 text-green-400 mb-2" />
            <p className="text-2xl font-bold">{user?._count?.predictions || 0}</p>
            <p className="text-xs text-gray-400">预测场次</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#1A1A2E]">
          <CardContent className="p-4 text-center">
            <span className="text-2xl mb-2 block">{levelInfo?.emoji}</span>
            <p className="text-lg font-bold">{levelInfo?.label}</p>
            <p className="text-xs text-gray-400">等级</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#1A1A2E]">
          <CardContent className="p-4 text-center">
            <span className="text-2xl mb-2 block">💬</span>
            <p className="text-2xl font-bold">{user?._count?.comments || 0}</p>
            <p className="text-xs text-gray-400">讨论</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/predictions" className="inline-flex flex-col items-center justify-center gap-1 rounded-lg border border-white/10 h-20 text-sm font-medium hover:bg-white/5 transition-colors">
          <Target className="h-6 w-6" />
          <span>我的预测</span>
        </Link>
        <Link href="/leaderboard" className="inline-flex flex-col items-center justify-center gap-1 rounded-lg border border-white/10 h-20 text-sm font-medium hover:bg-white/5 transition-colors">
          <Trophy className="h-6 w-6" />
          <span>排行榜</span>
        </Link>
      </div>
    </div>
  );
}
