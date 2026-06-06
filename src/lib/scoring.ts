/**
 * 积分计算引擎
 *
 * 积分规则：
 * - 小组赛：猜中胜平负 +3 分；猜中精确比分再 +2 分（共 +5 分）
 * - 淘汰赛：猜中晋级者 +5 分；猜中精确比分再 +3 分（共 +8 分）
 * - 冠军预测正确：+20 分（独立加分）
 * - 金靴奖预测正确：+10 分（独立加分）
 * - 未在截止时间前预测：0 分
 */

export interface PredictionInput {
  homeScore: number;
  awayScore: number;
  predictedWinner?: string | null; // teamId, knockout only
}

export interface MatchResult {
  homeScore: number;
  awayScore: number;
  stage: string; // "group" | "round32" | "round16" | "quarter" | "semi" | "third" | "final"
  homeTeamId: string;
  awayTeamId: string;
}

/**
 * 计算单场比赛预测得分
 */
export function calculateMatchPoints(
  prediction: PredictionInput,
  result: MatchResult
): number {
  const isGroup = result.stage === "group";
  const predictedOutcome = getOutcome(prediction.homeScore, prediction.awayScore);
  const actualOutcome = getOutcome(result.homeScore, result.awayScore);

  let points = 0;

  if (isGroup) {
    // 小组赛：猜中胜平负 +3
    if (predictedOutcome === actualOutcome) {
      points += 3;

      // 猜中精确比分 额外 +2（总共 +5）
      if (
        prediction.homeScore === result.homeScore &&
        prediction.awayScore === result.awayScore
      ) {
        points += 2;
      }
    }
  } else {
    // 淘汰赛：猜中晋级者 +5
    const actualWinner = getWinner(result);
    const predictedWinnerTeamId = prediction.predictedWinner;

    if (predictedWinnerTeamId === actualWinner) {
      points += 5;

      // 猜中精确比分 额外 +3（总共 +8）
      if (
        prediction.homeScore === result.homeScore &&
        prediction.awayScore === result.awayScore
      ) {
        points += 3;
      }
    }
  }

  return points;
}

/**
 * 获取比赛结果：胜平负
 */
function getOutcome(
  homeScore: number,
  awayScore: number
): "home" | "draw" | "away" {
  if (homeScore > awayScore) return "home";
  if (homeScore < awayScore) return "away";
  return "draw";
}

/**
 * 获取比赛胜者 teamId（淘汰赛专用）
 */
function getWinner(result: MatchResult): string {
  if (result.homeScore > result.awayScore) return result.homeTeamId;
  if (result.homeScore < result.awayScore) return result.awayTeamId;
  // 平局看加时/点球（此处简化：如果有数据则由外部传入赢家）
  return result.homeTeamId; // placeholder, actual PK winner should be tracked separately
}

/**
 * 冠军预测得分
 */
export const CHAMPION_POINTS = 20;

/**
 * 金靴奖预测得分
 */
export const GOLDEN_BOOT_POINTS = 10;

/**
 * 排行榜 Tiebreaker 排序函数
 * 1. 冠军预测命中数（多者优先）
 * 2. 精确比分预测命中次数（多者优先）
 * 3. 预测提交时间早者优先（总用时少）
 */
export function tiebreakerCompare(
  a: {
    totalPoints: number;
    championHits: number;
    exactScoreHits: number;
    totalPredictionTime: number; // ms
  },
  b: {
    totalPoints: number;
    championHits: number;
    exactScoreHits: number;
    totalPredictionTime: number;
  }
): number {
  if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
  if (b.championHits !== a.championHits) return b.championHits - a.championHits;
  if (b.exactScoreHits !== a.exactScoreHits)
    return b.exactScoreHits - a.exactScoreHits;
  return a.totalPredictionTime - b.totalPredictionTime; // 早者优先
}

/**
 * 检查预测是否在截止时间前
 * 截止时间 = 比赛开球前 5 分钟
 */
export function isBeforeDeadline(matchTime: Date): boolean {
  const now = new Date();
  const deadline = new Date(matchTime.getTime() - 5 * 60 * 1000);
  return now < deadline;
}
