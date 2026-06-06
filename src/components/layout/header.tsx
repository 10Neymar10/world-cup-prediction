"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Trophy, Swords, Users, UserCircle, LogOut, Settings } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/matches", label: "赛程", icon: Swords },
  { href: "/standings", label: "积分榜", icon: Trophy },
  { href: "/leaderboard", label: "排行榜", icon: Users },
  { href: "/teams", label: "球队", icon: Users },
  { href: "/players", label: "球员", icon: UserCircle },
];

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0F0F1A]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-2xl">⚽</span>
          <span className="hidden sm:inline bg-gradient-to-r from-[#C8102E] to-[#FFD700] bg-clip-text text-transparent">
            World Cup 2026
          </span>
          <span className="sm:hidden text-white">WC26</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-secondary text-[#FFD700]"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-[#FFD700]/50 transition-all">
                  <AvatarImage src={session.user.image || ""} />
                  <AvatarFallback className="bg-[#C8102E] text-white text-xs">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="bg-[#C8102E] text-white text-xs">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{session.user.name}</span>
                    <span className="text-xs text-gray-400">{session.user.email}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/predictions" className="flex items-center w-full">
                    <Swords className="mr-2 h-4 w-4" /> 我的预测
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/profile" className="flex items-center w-full">
                    <UserCircle className="mr-2 h-4 w-4" /> 个人中心
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/profile/settings" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" /> 账号设置
                  </Link>
                </DropdownMenuItem>
                {(session.user as any)?.role === "admin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/admin" className="flex items-center w-full text-[#FFD700]">
                        ⚙ 管理后台
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-400 cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" /> 退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center rounded-lg bg-[#C8102E] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#a00d24] transition-colors"
            >
              登录
            </Link>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger>
              <button className="inline-flex items-center justify-center rounded-lg p-2 text-gray-300 hover:bg-white/5 md:hidden">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#1A1A2E] border-white/10">
              <nav className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center gap-3 rounded-lg px-3 py-2.5 text-lg font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
