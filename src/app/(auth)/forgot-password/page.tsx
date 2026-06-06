"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "发送失败");
        return;
      }

      setSent(true);
    } catch {
      setError("网络错误，请重试");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F1A] px-4">
      <Card className="w-full max-w-md border-white/10 bg-[#1A1A2E]">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">🔑</div>
          <CardTitle className="text-2xl text-white">找回密码</CardTitle>
          <CardDescription>
            {sent ? "邮件已发送，请查收" : "输入注册邮箱，我们将发送重置链接"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/10"
                />
              </div>
              <Button type="submit" className="w-full bg-[#C8102E] hover:bg-[#a00d24]">
                发送重置邮件
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-green-400 mb-4">✅ 重置邮件已发送至 {email}</p>
              <p className="text-sm text-gray-400">请检查收件箱（包括垃圾邮件文件夹）</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/auth/login" className="text-sm text-[#FFD700] hover:underline">
            返回登录
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
