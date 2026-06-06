import type { User, Match, Team, Player, Prediction } from "@prisma/client";

export type SafeUser = Omit<User, "passwordHash">;

export type MatchWithTeams = Match & {
  homeTeam: Team;
  awayTeam: Team;
};

export type PredictionWithMatch = Prediction & {
  match: MatchWithTeams;
};

export type LeaderboardEntry = {
  userId: string;
  name: string;
  avatar: string | null;
  level: string;
  totalPoints: number;
  championHits: number;
  exactScoreHits: number;
  totalPredictionTime: number;
  rank: number;
  rankChange: number; // positive = rising
};

export type TeamStanding = {
  teamId: string;
  teamName: string;
  flag: string | null;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  status: "qualified" | "pending" | "eliminated" | "finished";
};

export type MatchWithPrediction = MatchWithTeams & {
  userPrediction?: Prediction | null;
};
