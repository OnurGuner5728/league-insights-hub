import { League, Continent } from '@/types/football';

export const LEAGUES: Record<string, League> = {
  // Europe
  'eng.1': { code: 'eng.1', name: 'Premier League', country: 'England', continent: 'europe', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  'eng.2': { code: 'eng.2', name: 'Championship', country: 'England', continent: 'europe', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  'esp.1': { code: 'esp.1', name: 'La Liga', country: 'Spain', continent: 'europe', flag: '🇪🇸' },
  'esp.2': { code: 'esp.2', name: 'Segunda División', country: 'Spain', continent: 'europe', flag: '🇪🇸' },
  'ger.1': { code: 'ger.1', name: 'Bundesliga', country: 'Germany', continent: 'europe', flag: '🇩🇪' },
  'ger.2': { code: 'ger.2', name: '2. Bundesliga', country: 'Germany', continent: 'europe', flag: '🇩🇪' },
  'ita.1': { code: 'ita.1', name: 'Serie A', country: 'Italy', continent: 'europe', flag: '🇮🇹' },
  'ita.2': { code: 'ita.2', name: 'Serie B', country: 'Italy', continent: 'europe', flag: '🇮🇹' },
  'fra.1': { code: 'fra.1', name: 'Ligue 1', country: 'France', continent: 'europe', flag: '🇫🇷' },
  'fra.2': { code: 'fra.2', name: 'Ligue 2', country: 'France', continent: 'europe', flag: '🇫🇷' },
  'ned.1': { code: 'ned.1', name: 'Eredivisie', country: 'Netherlands', continent: 'europe', flag: '🇳🇱' },
  'por.1': { code: 'por.1', name: 'Primeira Liga', country: 'Portugal', continent: 'europe', flag: '🇵🇹' },
  'tur.1': { code: 'tur.1', name: 'Süper Lig', country: 'Turkey', continent: 'europe', flag: '🇹🇷' },
  'tur.2': { code: 'tur.2', name: '1. Lig', country: 'Turkey', continent: 'europe', flag: '🇹🇷' },
  'bel.1': { code: 'bel.1', name: 'Belgian Pro League', country: 'Belgium', continent: 'europe', flag: '🇧🇪' },
  'sco.1': { code: 'sco.1', name: 'Scottish Premiership', country: 'Scotland', continent: 'europe', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  'rus.1': { code: 'rus.1', name: 'Russian Premier League', country: 'Russia', continent: 'europe', flag: '🇷🇺' },
  'ukr.1': { code: 'ukr.1', name: 'Ukrainian Premier League', country: 'Ukraine', continent: 'europe', flag: '🇺🇦' },
  'gre.1': { code: 'gre.1', name: 'Super League Greece', country: 'Greece', continent: 'europe', flag: '🇬🇷' },
  'sui.1': { code: 'sui.1', name: 'Swiss Super League', country: 'Switzerland', continent: 'europe', flag: '🇨🇭' },
  'aut.1': { code: 'aut.1', name: 'Austrian Bundesliga', country: 'Austria', continent: 'europe', flag: '🇦🇹' },
  'den.1': { code: 'den.1', name: 'Danish Superliga', country: 'Denmark', continent: 'europe', flag: '🇩🇰' },
  'nor.1': { code: 'nor.1', name: 'Eliteserien', country: 'Norway', continent: 'europe', flag: '🇳🇴' },
  'swe.1': { code: 'swe.1', name: 'Allsvenskan', country: 'Sweden', continent: 'europe', flag: '🇸🇪' },
  'pol.1': { code: 'pol.1', name: 'Ekstraklasa', country: 'Poland', continent: 'europe', flag: '🇵🇱' },
  'cze.1': { code: 'cze.1', name: 'Czech First League', country: 'Czechia', continent: 'europe', flag: '🇨🇿' },

  // Americas
  'usa.1': { code: 'usa.1', name: 'MLS', country: 'USA', continent: 'americas', flag: '🇺🇸' },
  'mex.1': { code: 'mex.1', name: 'Liga MX', country: 'Mexico', continent: 'americas', flag: '🇲🇽' },
  'bra.1': { code: 'bra.1', name: 'Brasileirão', country: 'Brazil', continent: 'americas', flag: '🇧🇷' },
  'bra.2': { code: 'bra.2', name: 'Série B', country: 'Brazil', continent: 'americas', flag: '🇧🇷' },
  'arg.1': { code: 'arg.1', name: 'Primera División', country: 'Argentina', continent: 'americas', flag: '🇦🇷' },
  'col.1': { code: 'col.1', name: 'Categoría Primera A', country: 'Colombia', continent: 'americas', flag: '🇨🇴' },
  'chi.1': { code: 'chi.1', name: 'Primera División', country: 'Chile', continent: 'americas', flag: '🇨🇱' },
  'per.1': { code: 'per.1', name: 'Liga 1', country: 'Peru', continent: 'americas', flag: '🇵🇪' },
  'ecu.1': { code: 'ecu.1', name: 'Serie A', country: 'Ecuador', continent: 'americas', flag: '🇪🇨' },
  'uru.1': { code: 'uru.1', name: 'Primera División', country: 'Uruguay', continent: 'americas', flag: '🇺🇾' },

  // Asia & Oceania
  'jpn.1': { code: 'jpn.1', name: 'J1 League', country: 'Japan', continent: 'asia', flag: '🇯🇵' },
  'kor.1': { code: 'kor.1', name: 'K League 1', country: 'South Korea', continent: 'asia', flag: '🇰🇷' },
  'chn.1': { code: 'chn.1', name: 'Chinese Super League', country: 'China', continent: 'asia', flag: '🇨🇳' },
  'aus.1': { code: 'aus.1', name: 'A-League', country: 'Australia', continent: 'oceania', flag: '🇦🇺' },
  'ind.1': { code: 'ind.1', name: 'Indian Super League', country: 'India', continent: 'asia', flag: '🇮🇳' },
  'sau.1': { code: 'sau.1', name: 'Saudi Pro League', country: 'Saudi Arabia', continent: 'asia', flag: '🇸🇦' },
  'uae.1': { code: 'uae.1', name: 'UAE Pro League', country: 'UAE', continent: 'asia', flag: '🇦🇪' },
  'qat.1': { code: 'qat.1', name: 'Qatar Stars League', country: 'Qatar', continent: 'asia', flag: '🇶🇦' },
  'tha.1': { code: 'tha.1', name: 'Thai League', country: 'Thailand', continent: 'asia', flag: '🇹🇭' },
  'mys.1': { code: 'mys.1', name: 'Malaysian Super League', country: 'Malaysia', continent: 'asia', flag: '🇲🇾' },

  // Africa
  'egy.1': { code: 'egy.1', name: 'Egyptian Premier League', country: 'Egypt', continent: 'africa', flag: '🇪🇬' },
  'rsa.1': { code: 'rsa.1', name: 'South African Premier', country: 'South Africa', continent: 'africa', flag: '🇿🇦' },
  'mor.1': { code: 'mor.1', name: 'Botola Pro', country: 'Morocco', continent: 'africa', flag: '🇲🇦' },
  'tun.1': { code: 'tun.1', name: 'Tunisian Ligue 1', country: 'Tunisia', continent: 'africa', flag: '🇹🇳' },
  'alg.1': { code: 'alg.1', name: 'Ligue 1', country: 'Algeria', continent: 'africa', flag: '🇩🇿' },
  'nga.1': { code: 'nga.1', name: 'NPFL', country: 'Nigeria', continent: 'africa', flag: '🇳🇬' },

  // International
  'uefa.champions': { code: 'uefa.champions', name: 'UEFA Champions League', continent: 'international', flag: '🏆' },
  'uefa.europa': { code: 'uefa.europa', name: 'UEFA Europa League', continent: 'international', flag: '🏆' },
  'uefa.europa.conf': { code: 'uefa.europa.conf', name: 'UEFA Conference League', continent: 'international', flag: '🏆' },
  'conmebol.libertadores': { code: 'conmebol.libertadores', name: 'Copa Libertadores', continent: 'international', flag: '🏆' },
  'conmebol.sudamericana': { code: 'conmebol.sudamericana', name: 'Copa Sudamericana', continent: 'international', flag: '🏆' },
  'afc.champions': { code: 'afc.champions', name: 'AFC Champions League', continent: 'international', flag: '🏆' },
  'caf.nations': { code: 'caf.nations', name: 'Africa Cup of Nations', continent: 'international', flag: '🏆' },
  'fifa.world': { code: 'fifa.world', name: 'FIFA World Cup', continent: 'international', flag: '🏆' },
  'uefa.euro': { code: 'uefa.euro', name: 'UEFA Euro', continent: 'international', flag: '🏆' },

  // Cups
  'eng.fa': { code: 'eng.fa', name: 'FA Cup', country: 'England', continent: 'europe', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  'eng.league_cup': { code: 'eng.league_cup', name: 'EFL Cup', country: 'England', continent: 'europe', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  'esp.copa_del_rey': { code: 'esp.copa_del_rey', name: 'Copa del Rey', country: 'Spain', continent: 'europe', flag: '🇪🇸' },
  'ger.dfb_pokal': { code: 'ger.dfb_pokal', name: 'DFB Pokal', country: 'Germany', continent: 'europe', flag: '🇩🇪' },
  'ita.coppa_italia': { code: 'ita.coppa_italia', name: 'Coppa Italia', country: 'Italy', continent: 'europe', flag: '🇮🇹' },
  'fra.coupe_de_france': { code: 'fra.coupe_de_france', name: 'Coupe de France', country: 'France', continent: 'europe', flag: '🇫🇷' },
};

export const CONTINENTS: Continent[] = [
  {
    id: 'europe',
    name: 'Avrupa',
    emoji: '🇪🇺',
    leagues: Object.values(LEAGUES).filter(l => l.continent === 'europe'),
  },
  {
    id: 'americas',
    name: 'Amerika',
    emoji: '🌎',
    leagues: Object.values(LEAGUES).filter(l => l.continent === 'americas'),
  },
  {
    id: 'asia',
    name: 'Asya',
    emoji: '🌏',
    leagues: Object.values(LEAGUES).filter(l => l.continent === 'asia'),
  },
  {
    id: 'africa',
    name: 'Afrika',
    emoji: '🌍',
    leagues: Object.values(LEAGUES).filter(l => l.continent === 'africa'),
  },
  {
    id: 'oceania',
    name: 'Okyanusya',
    emoji: '🌊',
    leagues: Object.values(LEAGUES).filter(l => l.continent === 'oceania'),
  },
  {
    id: 'international',
    name: 'Uluslararası',
    emoji: '🏆',
    leagues: Object.values(LEAGUES).filter(l => l.continent === 'international'),
  },
];

export const TOP_LEAGUES = ['eng.1', 'esp.1', 'ger.1', 'ita.1', 'fra.1', 'tur.1', 'uefa.champions'];

export function getLeagueName(code: string): string {
  return LEAGUES[code]?.name || code;
}

export function getLeagueFlag(code: string): string {
  return LEAGUES[code]?.flag || '⚽';
}
