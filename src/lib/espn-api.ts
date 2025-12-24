import { Match, Standing } from '@/types/football';
import { LEAGUES, getLeagueName } from '@/data/leagues';

const BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer';

interface ESPNEvent {
  id: string;
  date: string;
  name: string;
  season?: {
    slug: string;
  };
  competitions?: Array<{
    id: string;
    status?: {
      displayClock?: string;
      type?: {
        state: string;
        description: string;
      };
    };
    venue?: {
      fullName: string;
      address?: {
        country: string;
      };
    };
    attendance?: number;
    competitors?: Array<{
      team: {
        id: string;
        displayName: string;
        abbreviation: string;
        logo?: string;
      };
      score?: string;
      form?: string;
      statistics?: Array<{
        name: string;
        displayValue: string;
      }>;
    }>;
    details?: Array<{
      type: {
        text: string;
      };
      clock: {
        displayValue: string;
      };
      team?: {
        id: string;
      };
      athletesInvolved?: Array<{
        displayName: string;
      }>;
    }>;
    odds?: Array<{
      homeTeamOdds?: {
        value?: number;
      };
      awayTeamOdds?: {
        value?: number;
      };
      drawOdds?: {
        value?: number;
      };
    }>;
  }>;
}

function parseMatch(event: ESPNEvent): Match | null {
  const comp = event.competitions?.[0];
  if (!comp) return null;

  const home = comp.competitors?.[0];
  const away = comp.competitors?.[1];
  if (!home || !away) return null;

  const statusType = comp.status?.type;
  
  const homeStats: Record<string, string> = {};
  const awayStats: Record<string, string> = {};
  
  home.statistics?.forEach(s => {
    homeStats[s.name] = s.displayValue;
  });
  
  away.statistics?.forEach(s => {
    awayStats[s.name] = s.displayValue;
  });

  const oddsData = comp.odds?.[0];

  return {
    id: event.id,
    league: event.season?.slug || 'unknown',
    leagueName: getLeagueName(event.season?.slug || ''),
    date: event.date,
    status: statusType?.state as 'pre' | 'in' | 'post' || 'pre',
    statusDetail: statusType?.description,
    minute: comp.status?.displayClock,
    home: {
      id: home.team.id,
      name: home.team.displayName,
      short: home.team.abbreviation,
      logo: home.team.logo,
      score: parseInt(home.score || '0', 10),
      form: home.form,
    },
    away: {
      id: away.team.id,
      name: away.team.displayName,
      short: away.team.abbreviation,
      logo: away.team.logo,
      score: parseInt(away.score || '0', 10),
      form: away.form,
    },
    venue: comp.venue?.fullName,
    attendance: comp.attendance,
    stats: {
      home: homeStats,
      away: awayStats,
    },
    events: comp.details?.map(d => ({
      type: d.type.text,
      minute: d.clock.displayValue,
      teamId: d.team?.id,
      player: d.athletesInvolved?.[0]?.displayName,
    })),
    odds: oddsData ? {
      homeOdds: oddsData.homeTeamOdds?.value,
      awayOdds: oddsData.awayTeamOdds?.value,
      drawOdds: oddsData.drawOdds?.value,
    } : undefined,
  };
}

export async function getAllMatches(date?: Date): Promise<Match[]> {
  try {
    let url = `${BASE_URL}/all/scoreboard`;
    if (date) {
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
      url += `?dates=${dateStr}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch matches');
    
    const data = await response.json();
    const matches: Match[] = [];

    for (const event of data.events || []) {
      const match = parseMatch(event);
      if (match) matches.push(match);
    }

    return matches;
  } catch (error) {
    console.error('Error fetching all matches:', error);
    return [];
  }
}

export async function getLiveMatches(): Promise<Match[]> {
  const allMatches = await getAllMatches();
  return allMatches.filter(m => m.status === 'in');
}

export async function getLeagueMatches(leagueCode: string, date?: Date): Promise<Match[]> {
  try {
    let url = `${BASE_URL}/${leagueCode}/scoreboard`;
    if (date) {
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
      url += `?dates=${dateStr}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch league matches');
    
    const data = await response.json();
    const matches: Match[] = [];

    for (const event of data.events || []) {
      const match = parseMatch(event);
      if (match) matches.push(match);
    }

    return matches;
  } catch (error) {
    console.error(`Error fetching ${leagueCode} matches:`, error);
    return [];
  }
}

export async function getLeagueStandings(leagueCode: string): Promise<Standing[]> {
  try {
    const url = `${BASE_URL}/${leagueCode}/standings`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch standings');
    
    const data = await response.json();
    const standings: Standing[] = [];

    const entries = data.children?.[0]?.standings?.entries || [];
    
    for (const entry of entries) {
      const stats = entry.stats || [];
      const getStatValue = (name: string): number => {
        const stat = stats.find((s: any) => s.name === name);
        return parseInt(stat?.value || '0', 10);
      };

      standings.push({
        position: getStatValue('rank') || entries.indexOf(entry) + 1,
        team: {
          id: entry.team?.id || '',
          name: entry.team?.displayName || '',
          logo: entry.team?.logos?.[0]?.href,
        },
        played: getStatValue('gamesPlayed'),
        won: getStatValue('wins'),
        drawn: getStatValue('ties'),
        lost: getStatValue('losses'),
        goalsFor: getStatValue('pointsFor'),
        goalsAgainst: getStatValue('pointsAgainst'),
        goalDifference: getStatValue('pointDifferential'),
        points: getStatValue('points'),
        form: entry.team?.form,
      });
    }

    return standings.sort((a, b) => a.position - b.position);
  } catch (error) {
    console.error(`Error fetching ${leagueCode} standings:`, error);
    return [];
  }
}

export async function getMatchesByContinent(continent: string): Promise<Match[]> {
  const allMatches = await getAllMatches();
  const continentLeagues = Object.values(LEAGUES)
    .filter(l => l.continent === continent)
    .map(l => l.code);
  
  return allMatches.filter(m => continentLeagues.includes(m.league));
}
