export interface Team {
  id: string;
  name: string;
  short: string;
  logo?: string;
  score: number;
  form?: string;
}

export interface MatchEvent {
  type: string;
  minute: string;
  teamId?: string;
  player?: string;
}

export interface MatchStats {
  possession?: string;
  shots?: string;
  shotsOnTarget?: string;
  corners?: string;
  fouls?: string;
  yellowCards?: string;
  redCards?: string;
  offsides?: string;
  saves?: string;
}

export interface Match {
  id: string;
  league: string;
  leagueName?: string;
  date: string;
  status: 'pre' | 'in' | 'post';
  statusDetail?: string;
  minute?: string;
  home: Team;
  away: Team;
  venue?: string;
  attendance?: number;
  stats?: {
    home: MatchStats;
    away: MatchStats;
  };
  events?: MatchEvent[];
  odds?: {
    homeOdds?: number;
    awayOdds?: number;
    drawOdds?: number;
  };
}

export interface League {
  code: string;
  name: string;
  country?: string;
  continent: 'europe' | 'americas' | 'asia' | 'africa' | 'oceania' | 'international';
  flag?: string;
}

export interface Standing {
  position: number;
  team: {
    id: string;
    name: string;
    logo?: string;
  };
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string;
}

export interface PredictionResult {
  homeXg: number;
  awayXg: number;
  probabilities: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
  impliedOdds: {
    home: number;
    draw: number;
    away: number;
  };
  overUnder: {
    over05: number;
    over15: number;
    over25: number;
    over35: number;
  };
  btts: {
    yes: number;
    no: number;
  };
  topScores: Array<{
    score: string;
    prob: number;
  }>;
  expectedGoals: number;
}

export interface Continent {
  id: string;
  name: string;
  emoji: string;
  leagues: League[];
}
