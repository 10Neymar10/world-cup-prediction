import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

const prisma = new PrismaClient();

// ========== 48 支球队 ==========
const teams = [
  // Group A
  { name: "美国", nameEn: "USA", flag: "🇺🇸", fifaRank: 11, group: "A" },
  { name: "墨西哥", nameEn: "Mexico", flag: "🇲🇽", fifaRank: 14, group: "A" },
  { name: "塞内加尔", nameEn: "Senegal", flag: "🇸🇳", fifaRank: 20, group: "A" },
  { name: "新西兰", nameEn: "New Zealand", flag: "🇳🇿", fifaRank: 103, group: "A" },
  // Group B
  { name: "阿根廷", nameEn: "Argentina", flag: "🇦🇷", fifaRank: 1, group: "B" },
  { name: "荷兰", nameEn: "Netherlands", flag: "🇳🇱", fifaRank: 6, group: "B" },
  { name: "韩国", nameEn: "South Korea", flag: "🇰🇷", fifaRank: 25, group: "B" },
  { name: "加纳", nameEn: "Ghana", flag: "🇬🇭", fifaRank: 60, group: "B" },
  // Group C
  { name: "法国", nameEn: "France", flag: "🇫🇷", fifaRank: 2, group: "C" },
  { name: "乌拉圭", nameEn: "Uruguay", flag: "🇺🇾", fifaRank: 16, group: "C" },
  { name: "埃及", nameEn: "Egypt", flag: "🇪🇬", fifaRank: 35, group: "C" },
  { name: "阿联酋", nameEn: "UAE", flag: "🇦🇪", fifaRank: 72, group: "C" },
  // Group D
  { name: "英格兰", nameEn: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", fifaRank: 5, group: "D" },
  { name: "丹麦", nameEn: "Denmark", flag: "🇩🇰", fifaRank: 19, group: "D" },
  { name: "伊朗", nameEn: "Iran", flag: "🇮🇷", fifaRank: 22, group: "D" },
  { name: "布基纳法索", nameEn: "Burkina Faso", flag: "🇧🇫", fifaRank: 55, group: "D" },
  // Group E
  { name: "巴西", nameEn: "Brazil", flag: "🇧🇷", fifaRank: 3, group: "E" },
  { name: "克罗地亚", nameEn: "Croatia", flag: "🇭🇷", fifaRank: 7, group: "E" },
  { name: "日本", nameEn: "Japan", flag: "🇯🇵", fifaRank: 20, group: "E" },
  { name: "加拿大", nameEn: "Canada", flag: "🇨🇦", fifaRank: 43, group: "E" },
  // Group F
  { name: "葡萄牙", nameEn: "Portugal", flag: "🇵🇹", fifaRank: 9, group: "F" },
  { name: "哥伦比亚", nameEn: "Colombia", flag: "🇨🇴", fifaRank: 17, group: "F" },
  { name: "澳大利亚", nameEn: "Australia", flag: "🇦🇺", fifaRank: 27, group: "F" },
  { name: "伊拉克", nameEn: "Iraq", flag: "🇮🇶", fifaRank: 68, group: "F" },
  // Group G
  { name: "西班牙", nameEn: "Spain", flag: "🇪🇸", fifaRank: 8, group: "G" },
  { name: "瑞士", nameEn: "Switzerland", flag: "🇨🇭", fifaRank: 12, group: "G" },
  { name: "摩洛哥", nameEn: "Morocco", flag: "🇲🇦", fifaRank: 13, group: "G" },
  { name: "秘鲁", nameEn: "Peru", flag: "🇵🇪", fifaRank: 21, group: "G" },
  // Group H
  { name: "德国", nameEn: "Germany", flag: "🇩🇪", fifaRank: 4, group: "H" },
  { name: "比利时", nameEn: "Belgium", flag: "🇧🇪", fifaRank: 10, group: "H" },
  { name: "尼日利亚", nameEn: "Nigeria", flag: "🇳🇬", fifaRank: 32, group: "H" },
  { name: "哥斯达黎加", nameEn: "Costa Rica", flag: "🇨🇷", fifaRank: 50, group: "H" },
  // Group I
  { name: "意大利", nameEn: "Italy", flag: "🇮🇹", fifaRank: 7, group: "I" },
  { name: "智利", nameEn: "Chile", flag: "🇨🇱", fifaRank: 31, group: "I" },
  { name: "科特迪瓦", nameEn: "Ivory Coast", flag: "🇨🇮", fifaRank: 47, group: "I" },
  { name: "卡塔尔", nameEn: "Qatar", flag: "🇶🇦", fifaRank: 58, group: "I" },
  // Group J
  { name: "摩洛哥", nameEn: "Morocco 2", flag: "🇲🇦", fifaRank: 13, group: "J" },
  { name: "塞尔维亚", nameEn: "Serbia", flag: "🇷🇸", fifaRank: 29, group: "J" },
  { name: "喀麦隆", nameEn: "Cameroon", flag: "🇨🇲", fifaRank: 43, group: "J" },
  { name: "沙特阿拉伯", nameEn: "Saudi Arabia", flag: "🇸🇦", fifaRank: 49, group: "J" },
  // Group K
  { name: "日本", nameEn: "Japan 2", flag: "🇯🇵", fifaRank: 20, group: "K" },
  { name: "波兰", nameEn: "Poland", flag: "🇵🇱", fifaRank: 26, group: "K" },
  { name: "阿尔及利亚", nameEn: "Algeria", flag: "🇩🇿", fifaRank: 34, group: "K" },
  { name: "巴拿马", nameEn: "Panama", flag: "🇵🇦", fifaRank: 61, group: "K" },
  // Group L
  { name: "挪威", nameEn: "Norway", flag: "🇳🇴", fifaRank: 15, group: "L" },
  { name: "瑞典", nameEn: "Sweden", flag: "🇸🇪", fifaRank: 23, group: "L" },
  { name: "捷克", nameEn: "Czech Republic", flag: "🇨🇿", fifaRank: 36, group: "L" },
  { name: "中国", nameEn: "China", flag: "🇨🇳", fifaRank: 79, group: "L" },
];

// ========== 关键球员 ==========
const players = [
  { name: "梅西", position: "forward", number: 10, teamIdx: 4 }, // 阿根廷
  { name: "姆巴佩", position: "forward", number: 10, teamIdx: 8 }, // 法国
  { name: "维尼修斯", position: "forward", number: 7, teamIdx: 16 }, // 巴西
  { name: "哈兰德", position: "forward", number: 9, teamIdx: 44 }, // 挪威
  { name: "贝林厄姆", position: "midfielder", number: 10, teamIdx: 12 }, // 英格兰
  { name: "穆西亚拉", position: "midfielder", number: 10, teamIdx: 28 }, // 德国
  { name: "C罗", position: "forward", number: 7, teamIdx: 20 }, // 葡萄牙
  { name: "亚马尔", position: "forward", number: 19, teamIdx: 24 }, // 西班牙
  { name: "劳塔罗", position: "forward", number: 22, teamIdx: 4 }, // 阿根廷
  { name: "萨卡", position: "forward", number: 7, teamIdx: 12 }, // 英格兰
  { name: "吕迪格", position: "defender", number: 2, teamIdx: 28 }, // 德国
  { name: "范戴克", position: "defender", number: 4, teamIdx: 4 }, // 荷兰 (teamIdx 5)
];

// ========== 生成小组赛 ==========
function generateGroupMatches(
  teams: { id: string; group: string }[],
  baseDate: Date
) {
  const matches: {
    homeTeamId: string;
    awayTeamId: string;
    matchTime: Date;
    stage: string;
    group: string;
    status: string;
  }[] = [];

  const groups = "ABCDEFGHIJKL".split("");
  for (const group of groups) {
    const groupTeams = teams.filter((t) => t.group === group);
    // 小组内循环赛：4队，每队互相踢一场 = 6场比赛
    const pairings = [
      [0, 1],
      [2, 3],
      [0, 2],
      [1, 3],
      [0, 3],
      [1, 2],
    ];
    const groupStartDate = new Date(baseDate);
    groupStartDate.setDate(
      groupStartDate.getDate() + groups.indexOf(group) * 3
    );

    for (let i = 0; i < pairings.length; i++) {
      const matchDate = new Date(groupStartDate);
      matchDate.setDate(matchDate.getDate() + Math.floor(i / 2) * 2);
      matchDate.setHours(16 + (i % 2) * 5, 0, 0, 0);

      matches.push({
        homeTeamId: groupTeams[pairings[i][0]].id,
        awayTeamId: groupTeams[pairings[i][1]].id,
        matchTime: matchDate,
        stage: "group",
        group,
        status: "scheduled",
      });
    }
  }

  return matches;
}

// ========== 主函数 ==========
async function main() {
  console.log("🌱 Seeding database...");

  // 清理旧数据
  await prisma.comment.deleteMany();
  await prisma.friend.deleteMany();
  await prisma.goldenBootPrediction.deleteMany();
  await prisma.championPrediction.deleteMany();
  await prisma.prediction.deleteMany();
  await prisma.match.deleteMany();
  await prisma.player.deleteMany();
  await prisma.team.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // 创建管理员
  const admin = await prisma.user.create({
    data: {
      email: "admin@worldcup.com",
      passwordHash: "$2a$10$placeholder", // will be replaced with actual bcrypt hash
      name: "管理员",
      role: "admin",
      level: "legend",
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // 批量创建球队
  const createdTeams: { id: string; group: string }[] = [];
  for (const t of teams) {
    const team = await prisma.team.create({ data: t });
    createdTeams.push({ id: team.id, group: team.group });
  }
  console.log(`✅ ${createdTeams.length} teams created`);

  // 创建球员
  for (const p of players) {
    const teamId = createdTeams[p.teamIdx]?.id;
    if (!teamId) continue;
    await prisma.player.create({
      data: {
        name: p.name,
        teamId,
        position: p.position,
        number: p.number,
      },
    });
  }
  console.log(`✅ Players created`);

  // 生成小组赛赛程
  const baseDate = new Date("2026-06-11T00:00:00Z"); // 2026世界杯开幕日
  const groupMatches = generateGroupMatches(createdTeams, baseDate);

  for (const m of groupMatches) {
    await prisma.match.create({ data: m });
  }
  console.log(`✅ ${groupMatches.length} group matches created`);

  // 生成淘汰赛赛程（占位，等小组赛结束后才能确定对阵）
  const knockoutStages = [
    { stage: "round32", label: "32强", count: 16, daysAfter: 16 },
    { stage: "round16", label: "16强", count: 8, daysAfter: 20 },
    { stage: "quarter", label: "8强", count: 4, daysAfter: 24 },
    { stage: "semi", label: "半决赛", count: 2, daysAfter: 28 },
    { stage: "third", label: "季军赛", count: 1, daysAfter: 31 },
    { stage: "final", label: "决赛", count: 1, daysAfter: 32 },
  ];

  // Shuffle helper
  function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  let teamIndex = 0;
  for (const ks of knockoutStages) {
    for (let i = 0; i < ks.count; i++) {
      const matchDate = new Date(baseDate);
      matchDate.setDate(matchDate.getDate() + ks.daysAfter + i);
      matchDate.setHours(19, 0, 0, 0);

      // 淘汰赛对阵暂时随机配对（实际比赛对阵由小组赛结果决定）
      const shuffled = shuffle(createdTeams);
      const homeId = shuffled[0].id;
      const awayId = shuffled[1].id;

      await prisma.match.create({
        data: {
          homeTeamId: homeId,
          awayTeamId: awayId,
          matchTime: matchDate,
          stage: ks.stage,
          group: null,
          status: "scheduled",
        },
      });
    }
  }
  console.log(`✅ Knockout matches created (placeholders)`);

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
