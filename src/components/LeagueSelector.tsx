import { CONTINENTS } from '@/data/leagues';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface LeagueSelectorProps {
  selectedLeague: string | null;
  onSelectLeague: (code: string) => void;
}

export function LeagueSelector({ selectedLeague, onSelectLeague }: LeagueSelectorProps) {
  return (
    <div className="space-y-6">
      {CONTINENTS.map(continent => (
        <div key={continent.id}>
          <h3 className="font-display text-lg mb-3 flex items-center gap-2">
            <span className="text-xl">{continent.emoji}</span>
            {continent.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {continent.leagues.map(league => (
              <button
                key={league.code}
                onClick={() => onSelectLeague(league.code)}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg text-left transition-all',
                  'hover:bg-secondary/50 group',
                  selectedLeague === league.code 
                    ? 'bg-primary/10 border border-primary/30' 
                    : 'bg-secondary/30 border border-transparent'
                )}
              >
                <span className="text-lg">{league.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{league.name}</div>
                  {league.country && (
                    <div className="text-xs text-muted-foreground">{league.country}</div>
                  )}
                </div>
                <ChevronRight className={cn(
                  'w-4 h-4 text-muted-foreground transition-transform',
                  'group-hover:translate-x-1 group-hover:text-primary'
                )} />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
