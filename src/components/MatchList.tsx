import { Match } from '@/types/football';
import { CONTINENTS } from '@/data/leagues';
import { MatchCard } from './MatchCard';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface MatchListProps {
  matches: Match[];
  groupByContinent?: boolean;
  groupByLeague?: boolean;
  onMatchClick?: (match: Match) => void;
  compact?: boolean;
  maxItems?: number;
}

export function MatchList({ 
  matches, 
  groupByContinent = false,
  groupByLeague = false,
  onMatchClick,
  compact = false,
  maxItems
}: MatchListProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (groupByContinent) {
    return (
      <div className="space-y-6">
        {CONTINENTS.map(continent => {
          const continentMatches = matches.filter(m => {
            const leagueCodes = continent.leagues.map(l => l.code);
            return leagueCodes.includes(m.league);
          });

          if (continentMatches.length === 0) return null;

          const isExpanded = expandedGroups.has(continent.id);
          const displayMatches = isExpanded ? continentMatches : continentMatches.slice(0, 3);

          return (
            <div key={continent.id} className="animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-xl flex items-center gap-2">
                  <span>{continent.emoji}</span>
                  <span>{continent.name}</span>
                  <span className="text-sm text-muted-foreground font-sans">
                    ({continentMatches.length} maç)
                  </span>
                </h3>
                {continentMatches.length > 3 && (
                  <button
                    onClick={() => toggleGroup(continent.id)}
                    className="text-sm text-primary flex items-center gap-1 hover:underline"
                  >
                    {isExpanded ? (
                      <>
                        <span>Gizle</span>
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Tümünü Gör ({continentMatches.length})</span>
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {displayMatches.map(match => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onClick={() => onMatchClick?.(match)}
                    compact={compact}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (groupByLeague) {
    const matchesByLeague = matches.reduce((acc, match) => {
      const key = match.league;
      if (!acc[key]) acc[key] = [];
      acc[key].push(match);
      return acc;
    }, {} as Record<string, Match[]>);

    return (
      <div className="space-y-6">
        {Object.entries(matchesByLeague).map(([league, leagueMatches]) => {
          const isExpanded = expandedGroups.has(league);
          const displayMatches = isExpanded ? leagueMatches : leagueMatches.slice(0, 4);
          const firstMatch = leagueMatches[0];

          return (
            <div key={league} className="animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-lg flex items-center gap-2">
                  <span>{firstMatch?.leagueName || league}</span>
                  <span className="text-sm text-muted-foreground font-sans">
                    ({leagueMatches.length} maç)
                  </span>
                </h3>
                {leagueMatches.length > 4 && (
                  <button
                    onClick={() => toggleGroup(league)}
                    className="text-sm text-primary flex items-center gap-1 hover:underline"
                  >
                    {isExpanded ? 'Gizle' : `+${leagueMatches.length - 4} daha`}
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {displayMatches.map(match => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onClick={() => onMatchClick?.(match)}
                    compact={compact}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const displayMatches = maxItems ? matches.slice(0, maxItems) : matches;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {displayMatches.map(match => (
        <MatchCard
          key={match.id}
          match={match}
          onClick={() => onMatchClick?.(match)}
          compact={compact}
        />
      ))}
    </div>
  );
}
