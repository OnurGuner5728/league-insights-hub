import { Match } from '@/types/football';
import { getLeagueFlag, getLeagueName } from '@/data/leagues';
import { cn } from '@/lib/utils';

interface MatchCardProps {
  match: Match;
  onClick?: () => void;
  compact?: boolean;
}

export function MatchCard({ match, onClick, compact = false }: MatchCardProps) {
  const isLive = match.status === 'in';
  const isFinished = match.status === 'post';

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'score-card cursor-pointer group',
        isLive && 'border-live/50 animate-pulse-glow'
      )}
    >
      {/* League Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getLeagueFlag(match.league)}</span>
          <span className="text-xs text-muted-foreground font-medium">
            {match.leagueName || getLeagueName(match.league)}
          </span>
        </div>
        {isLive && (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-live opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-live"></span>
            </span>
            <span className="text-xs font-bold text-live">{match.minute}</span>
          </div>
        )}
        {!isLive && !isFinished && (
          <span className="text-xs text-muted-foreground">
            {formatDate(match.date)} • {formatTime(match.date)}
          </span>
        )}
        {isFinished && (
          <span className="text-xs text-muted-foreground">Bitti</span>
        )}
      </div>

      {/* Teams */}
      <div className="space-y-2">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {match.home.logo ? (
              <img
                src={match.home.logo}
                alt={match.home.name}
                className="team-logo"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="team-logo flex items-center justify-center text-xs font-bold text-muted-foreground">
                {match.home.short}
              </div>
            )}
            <span className={cn(
              'font-medium truncate',
              match.home.score > match.away.score && isFinished && 'text-win'
            )}>
              {match.home.name}
            </span>
          </div>
          <span className={cn(
            'text-2xl font-display font-bold min-w-[2rem] text-right',
            match.home.score > match.away.score && 'text-win',
            isLive && 'animate-score-update'
          )}>
            {isFinished || isLive ? match.home.score : '-'}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {match.away.logo ? (
              <img
                src={match.away.logo}
                alt={match.away.name}
                className="team-logo"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="team-logo flex items-center justify-center text-xs font-bold text-muted-foreground">
                {match.away.short}
              </div>
            )}
            <span className={cn(
              'font-medium truncate',
              match.away.score > match.home.score && isFinished && 'text-win'
            )}>
              {match.away.name}
            </span>
          </div>
          <span className={cn(
            'text-2xl font-display font-bold min-w-[2rem] text-right',
            match.away.score > match.home.score && 'text-win',
            isLive && 'animate-score-update'
          )}>
            {isFinished || isLive ? match.away.score : '-'}
          </span>
        </div>
      </div>

      {/* Stats Preview (for live matches) */}
      {isLive && match.stats && !compact && (
        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="grid grid-cols-3 gap-2 text-xs">
            {match.stats.home.possession && (
              <div className="text-center">
                <div className="text-muted-foreground mb-1">Topla Oynama</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-semibold">{match.stats.home.possession}</span>
                  <span className="text-muted-foreground">-</span>
                  <span className="font-semibold">{match.stats.away.possession}</span>
                </div>
              </div>
            )}
            {match.stats.home.shotsOnTarget && (
              <div className="text-center">
                <div className="text-muted-foreground mb-1">İsabetli Şut</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-semibold">{match.stats.home.shotsOnTarget}</span>
                  <span className="text-muted-foreground">-</span>
                  <span className="font-semibold">{match.stats.away.shotsOnTarget}</span>
                </div>
              </div>
            )}
            {match.stats.home.corners && (
              <div className="text-center">
                <div className="text-muted-foreground mb-1">Korner</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-semibold">{match.stats.home.corners}</span>
                  <span className="text-muted-foreground">-</span>
                  <span className="font-semibold">{match.stats.away.corners}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Odds Preview */}
      {match.odds && !isFinished && !compact && (
        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-secondary/50 rounded-lg py-1.5 px-2 text-center">
              <div className="text-[10px] text-muted-foreground mb-0.5">1</div>
              <div className="text-sm font-semibold">{match.odds.homeOdds?.toFixed(2) || '-'}</div>
            </div>
            <div className="bg-secondary/50 rounded-lg py-1.5 px-2 text-center">
              <div className="text-[10px] text-muted-foreground mb-0.5">X</div>
              <div className="text-sm font-semibold">{match.odds.drawOdds?.toFixed(2) || '-'}</div>
            </div>
            <div className="bg-secondary/50 rounded-lg py-1.5 px-2 text-center">
              <div className="text-[10px] text-muted-foreground mb-0.5">2</div>
              <div className="text-sm font-semibold">{match.odds.awayOdds?.toFixed(2) || '-'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
