import { Match } from '@/types/football';
import { getLeagueFlag, getLeagueName } from '@/data/leagues';
import { PredictionPanel } from './PredictionPanel';
import { Button } from '@/components/ui/button';
import { X, MapPin, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchDetailProps {
  match: Match;
  onClose: () => void;
}

export function MatchDetail({ match, onClose }: MatchDetailProps) {
  const isLive = match.status === 'in';
  const isFinished = match.status === 'post';

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('tr-TR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const { date, time } = formatDateTime(match.date);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 px-4 pb-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{getLeagueFlag(match.league)}</span>
              <span className="font-medium">{match.leagueName || getLeagueName(match.league)}</span>
              {isLive && (
                <span className="flex items-center gap-1.5 text-live text-sm font-bold ml-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-live opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-live"></span>
                  </span>
                  CANLI
                </span>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Score Section */}
        <div className="p-6 text-center border-b border-border">
          <div className="flex items-center justify-center gap-6 mb-4">
            {/* Home Team */}
            <div className="flex-1 text-right">
              {match.home.logo && (
                <img
                  src={match.home.logo}
                  alt={match.home.name}
                  className="w-16 h-16 object-contain ml-auto mb-2"
                />
              )}
              <h2 className="font-display text-2xl">{match.home.name}</h2>
              {match.home.form && (
                <div className="flex items-center justify-end gap-1 mt-2">
                  {match.home.form.split('').slice(-5).map((r, i) => (
                    <span 
                      key={i}
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                        r === 'W' && 'bg-win/20 text-win',
                        r === 'D' && 'bg-draw/20 text-draw',
                        r === 'L' && 'bg-loss/20 text-loss'
                      )}
                    >
                      {r === 'W' ? 'G' : r === 'D' ? 'B' : 'M'}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Score */}
            <div className="flex-shrink-0">
              {isLive || isFinished ? (
                <div className="flex items-center gap-4">
                  <span className={cn(
                    'font-display text-5xl',
                    match.home.score > match.away.score && 'text-win'
                  )}>
                    {match.home.score}
                  </span>
                  <span className="text-3xl text-muted-foreground">-</span>
                  <span className={cn(
                    'font-display text-5xl',
                    match.away.score > match.home.score && 'text-win'
                  )}>
                    {match.away.score}
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="font-display text-3xl text-primary">{time}</div>
                  <div className="text-sm text-muted-foreground mt-1">{date}</div>
                </div>
              )}
              {isLive && (
                <div className="text-center mt-2 text-live font-bold">
                  {match.minute}'
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex-1 text-left">
              {match.away.logo && (
                <img
                  src={match.away.logo}
                  alt={match.away.name}
                  className="w-16 h-16 object-contain mr-auto mb-2"
                />
              )}
              <h2 className="font-display text-2xl">{match.away.name}</h2>
              {match.away.form && (
                <div className="flex items-center gap-1 mt-2">
                  {match.away.form.split('').slice(-5).map((r, i) => (
                    <span 
                      key={i}
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                        r === 'W' && 'bg-win/20 text-win',
                        r === 'D' && 'bg-draw/20 text-draw',
                        r === 'L' && 'bg-loss/20 text-loss'
                      )}
                    >
                      {r === 'W' ? 'G' : r === 'D' ? 'B' : 'M'}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Match Info */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            {match.venue && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {match.venue}
              </div>
            )}
            {match.attendance && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {match.attendance.toLocaleString()}
              </div>
            )}
            {!isLive && !isFinished && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {time}
              </div>
            )}
          </div>
        </div>

        {/* Stats & Events */}
        {(isLive || isFinished) && match.stats && (
          <div className="p-6 border-b border-border">
            <h3 className="font-display text-lg mb-4">Maç İstatistikleri</h3>
            <div className="space-y-3">
              {[
                { key: 'possession', label: 'Topla Oynama' },
                { key: 'shots', label: 'Şut' },
                { key: 'shotsOnTarget', label: 'İsabetli Şut' },
                { key: 'corners', label: 'Korner' },
                { key: 'fouls', label: 'Faul' },
              ].map(({ key, label }) => {
                const homeVal = match.stats?.home?.[key as keyof typeof match.stats.home];
                const awayVal = match.stats?.away?.[key as keyof typeof match.stats.away];
                if (!homeVal && !awayVal) return null;

                const homeNum = parseFloat(homeVal?.replace('%', '') || '0');
                const awayNum = parseFloat(awayVal?.replace('%', '') || '0');
                const total = homeNum + awayNum || 1;
                const homePercent = (homeNum / total) * 100;

                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{homeVal}</span>
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{awayVal}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                      <div 
                        className="h-full bg-primary transition-all"
                        style={{ width: `${homePercent}%` }}
                      />
                      <div 
                        className="h-full bg-muted-foreground transition-all"
                        style={{ width: `${100 - homePercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Match Events */}
        {match.events && match.events.length > 0 && (
          <div className="p-6 border-b border-border">
            <h3 className="font-display text-lg mb-4">Maç Olayları</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {match.events.map((event, i) => (
                <div 
                  key={i}
                  className={cn(
                    'flex items-center gap-3 p-2 rounded-lg bg-secondary/30',
                    event.teamId === match.home.id && 'flex-row',
                    event.teamId === match.away.id && 'flex-row-reverse'
                  )}
                >
                  <span className="text-xs text-muted-foreground w-10 text-center">
                    {event.minute}'
                  </span>
                  <span className="text-lg">
                    {event.type.toLowerCase().includes('goal') ? '⚽' :
                     event.type.toLowerCase().includes('yellow') ? '🟨' :
                     event.type.toLowerCase().includes('red') ? '🟥' :
                     event.type.toLowerCase().includes('substitution') ? '🔄' : '📌'}
                  </span>
                  <span className="text-sm">{event.player || event.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prediction Panel (for upcoming matches) */}
        {!isFinished && (
          <div className="p-6">
            <h3 className="font-display text-xl mb-4">Tahmin & Analiz</h3>
            <PredictionPanel match={match} />
          </div>
        )}
      </div>
    </div>
  );
}
