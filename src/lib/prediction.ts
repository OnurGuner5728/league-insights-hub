import { PredictionResult, Match } from '@/types/football';

// Poisson probability mass function
function poissonPmf(k: number, lambda: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  let result = Math.exp(-lambda);
  for (let i = 1; i <= k; i++) {
    result *= lambda / i;
  }
  return result;
}

export function calculatePrediction(
  homeXg: number,
  awayXg: number,
  homeAdvantage: number = 0.25
): PredictionResult {
  // Apply home advantage
  const adjHomeXg = homeXg + homeAdvantage;
  const adjAwayXg = awayXg;

  // Score probabilities (0-9 goals)
  const maxGoals = 10;
  const homeProbs: number[] = [];
  const awayProbs: number[] = [];

  for (let i = 0; i < maxGoals; i++) {
    homeProbs.push(poissonPmf(i, adjHomeXg));
    awayProbs.push(poissonPmf(i, adjAwayXg));
  }

  // Score matrix
  const scoreMatrix: number[][] = [];
  for (let i = 0; i < maxGoals; i++) {
    scoreMatrix[i] = [];
    for (let j = 0; j < maxGoals; j++) {
      scoreMatrix[i][j] = homeProbs[i] * awayProbs[j];
    }
  }

  // Calculate 1X2 probabilities
  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;

  for (let i = 0; i < maxGoals; i++) {
    for (let j = 0; j < maxGoals; j++) {
      if (i > j) homeWin += scoreMatrix[i][j];
      else if (i === j) draw += scoreMatrix[i][j];
      else awayWin += scoreMatrix[i][j];
    }
  }

  // Over/Under calculations
  const over05 = 1 - scoreMatrix[0][0];
  const over15 = 1 - (scoreMatrix[0][0] + scoreMatrix[0][1] + scoreMatrix[1][0]);
  
  let under25 = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i + j <= 2) under25 += scoreMatrix[i][j];
    }
  }
  const over25 = 1 - under25;

  let under35 = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (i + j <= 3) under35 += scoreMatrix[i][j];
    }
  }
  const over35 = 1 - under35;

  // BTTS (Both Teams To Score)
  let bttsNo = 0;
  for (let i = 0; i < maxGoals; i++) {
    bttsNo += scoreMatrix[0][i] + scoreMatrix[i][0];
  }
  bttsNo -= scoreMatrix[0][0]; // Remove double count
  const bttsYes = 1 - bttsNo;

  // Top 5 most likely scores
  const allScores: Array<{ home: number; away: number; prob: number }> = [];
  for (let i = 0; i < maxGoals; i++) {
    for (let j = 0; j < maxGoals; j++) {
      allScores.push({ home: i, away: j, prob: scoreMatrix[i][j] });
    }
  }
  allScores.sort((a, b) => b.prob - a.prob);
  const topScores = allScores.slice(0, 5).map(s => ({
    score: `${s.home}-${s.away}`,
    prob: Math.round(s.prob * 1000) / 10,
  }));

  return {
    homeXg: Math.round(adjHomeXg * 100) / 100,
    awayXg: Math.round(adjAwayXg * 100) / 100,
    probabilities: {
      homeWin: Math.round(homeWin * 1000) / 10,
      draw: Math.round(draw * 1000) / 10,
      awayWin: Math.round(awayWin * 1000) / 10,
    },
    impliedOdds: {
      home: homeWin > 0.01 ? Math.round(100 / homeWin) / 100 : 100,
      draw: draw > 0.01 ? Math.round(100 / draw) / 100 : 100,
      away: awayWin > 0.01 ? Math.round(100 / awayWin) / 100 : 100,
    },
    overUnder: {
      over05: Math.round(over05 * 1000) / 10,
      over15: Math.round(over15 * 1000) / 10,
      over25: Math.round(over25 * 1000) / 10,
      over35: Math.round(over35 * 1000) / 10,
    },
    btts: {
      yes: Math.round(bttsYes * 1000) / 10,
      no: Math.round(bttsNo * 1000) / 10,
    },
    topScores,
    expectedGoals: Math.round((adjHomeXg + adjAwayXg) * 100) / 100,
  };
}

// Estimate xG based on team form and league position
export function estimateXg(
  recentForm: string | undefined,
  isHome: boolean,
  leagueAvg: number = 1.3
): number {
  let xg = leagueAvg;

  if (recentForm) {
    const wins = (recentForm.match(/W/g) || []).length;
    const draws = (recentForm.match(/D/g) || []).length;
    const formBonus = (wins * 0.15) + (draws * 0.05) - ((5 - wins - draws) * 0.1);
    xg += formBonus;
  }

  if (isHome) {
    xg += 0.15; // Additional home advantage in xG estimation
  }

  return Math.max(0.5, Math.min(3.5, xg));
}

// Find value bets based on prediction vs bookmaker odds
export function findValueBets(
  prediction: PredictionResult,
  bookmakerOdds: { home?: number; draw?: number; away?: number },
  minValue: number = 0.05
): Array<{
  market: string;
  ourProb: number;
  bookieOdds: number;
  bookieImplied: number;
  value: number;
  edge: number;
  kelly: number;
}> {
  const valueBets: Array<{
    market: string;
    ourProb: number;
    bookieOdds: number;
    bookieImplied: number;
    value: number;
    edge: number;
    kelly: number;
  }> = [];

  const markets = [
    { key: 'home', prob: prediction.probabilities.homeWin / 100, odds: bookmakerOdds.home },
    { key: 'draw', prob: prediction.probabilities.draw / 100, odds: bookmakerOdds.draw },
    { key: 'away', prob: prediction.probabilities.awayWin / 100, odds: bookmakerOdds.away },
  ];

  for (const { key, prob, odds } of markets) {
    if (!odds || odds <= 1) continue;

    const impliedProb = 1 / odds;
    const value = (prob * odds) - 1;
    const edge = prob - impliedProb;
    const kelly = edge / (odds - 1);

    if (value > minValue) {
      valueBets.push({
        market: key === 'home' ? 'Ev Sahibi' : key === 'away' ? 'Deplasman' : 'Beraberlik',
        ourProb: Math.round(prob * 1000) / 10,
        bookieOdds: odds,
        bookieImplied: Math.round(impliedProb * 1000) / 10,
        value: Math.round(value * 1000) / 10,
        edge: Math.round(edge * 1000) / 10,
        kelly: Math.round(kelly * 100) / 100,
      });
    }
  }

  return valueBets.sort((a, b) => b.value - a.value);
}
