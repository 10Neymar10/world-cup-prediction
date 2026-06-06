import { z } from "zod";

export const predictionSchema = z.object({
  matchId: z.string().uuid(),
  homeScore: z.number().int().min(0).max(99),
  awayScore: z.number().int().min(0).max(99),
  predictedWinner: z.string().uuid().optional().nullable(),
  visibility: z.enum(["public", "friends_only", "private"]).default("public"),
});

export const championPredictionSchema = z.object({
  teamId: z.string().uuid(),
});

export const goldenBootPredictionSchema = z.object({
  playerId: z.string().uuid(),
});

export const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(8, "密码至少 8 位"),
});

export const registerSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z
    .string()
    .min(8, "密码至少 8 位")
    .regex(/[A-Z]/, "密码需包含大写字母")
    .regex(/[a-z]/, "密码需包含小写字母")
    .regex(/[0-9]/, "密码需包含数字"),
  name: z.string().min(2, "昵称至少 2 个字符").max(32),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(32).optional(),
  avatar: z.string().url().optional().nullable(),
  bio: z.string().max(200).optional().nullable(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8, "密码至少 8 位")
    .regex(/[A-Z]/, "密码需包含大写字母")
    .regex(/[a-z]/, "密码需包含小写字母")
    .regex(/[0-9]/, "密码需包含数字"),
});

export const commentSchema = z.object({
  matchId: z.string().uuid(),
  content: z.string().min(1).max(1000),
  parentId: z.string().uuid().optional().nullable(),
});

export const matchResultSchema = z.object({
  homeScore: z.number().int().min(0),
  awayScore: z.number().int().min(0),
  status: z.enum(["scheduled", "live", "finished", "cancelled"]),
});

export type PredictionInput = z.infer<typeof predictionSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
