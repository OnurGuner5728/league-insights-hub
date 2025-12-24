import { Standing } from '@/types/football';
import { cn } from '@/lib/utils';

interface StandingsTableProps {
  standings: Standing[];
  compact?: boolean;
}

export function StandingsTable({ standings, compact = false }: StandingsTableProps) {
  const getFormBadge = (result: string) => {
    switch (result) {
      case 'W':
        return <span className="w-5 h-5 rounded-full bg-win/20 text-win flex items-center justify-center text-[10px] font-bold">G</span>;
      case 'D':
        return <span className="w-5 h-5 rounded-full bg-draw/20 text-draw flex items-center justify-center text-[10px] font-bold">B</span>;
      case 'L':
        return <span className="w-5 h-5 rounded-full bg-loss/20 text-loss flex items-center justify-center text-[10px] font-bold">M</span>;
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground text-xs">
            <th className="text-left py-3 px-2 font-medium">#</th>
            <th className="text-left py-3 px-2 font-medium">Takım</th>
            <th className="text-center py-3 px-2 font-medium">O</th>
            {!compact && (
              <>
                <th className="text-center py-3 px-2 font-medium">G</th>
                <th className="text-center py-3 px-2 font-medium">B</th>
                <th className="text-center py-3 px-2 font-medium">M</th>
                <th className="text-center py-3 px-2 font-medium">A</th>
                <th className="text-center py-3 px-2 font-medium">Y</th>
              </>
            )}
            <th className="text-center py-3 px-2 font-medium">AV</th>
            <th className="text-center py-3 px-2 font-medium">P</th>
            {!compact && <th className="text-center py-3 px-2 font-medium">Form</th>}
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => (
            <tr 
              key={team.team.id}
              className={cn(
                'border-b border-border/50 hover:bg-secondary/30 transition-colors',
                index < 4 && 'bg-primary/5',
                index >= standings.length - 3 && 'bg-destructive/5'
              )}
            >
              <td className="py-3 px-2">
                <span className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                  index < 4 && 'bg-primary/20 text-primary',
                  index >= standings.length - 3 && 'bg-destructive/20 text-destructive'
                )}>
                  {team.position}
                </span>
              </td>
              <td className="py-3 px-2">
                <div className="flex items-center gap-2">
                  {team.team.logo ? (
                    <img 
                      src={team.team.logo} 
                      alt={team.team.name}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-[10px] font-bold">
                      {team.team.name.slice(0, 2)}
                    </div>
                  )}
                  <span className="font-medium truncate max-w-[120px] sm:max-w-[180px]">
                    {team.team.name}
                  </span>
                </div>
              </td>
              <td className="text-center py-3 px-2 text-muted-foreground">{team.played}</td>
              {!compact && (
                <>
                  <td className="text-center py-3 px-2 text-win">{team.won}</td>
                  <td className="text-center py-3 px-2 text-draw">{team.drawn}</td>
                  <td className="text-center py-3 px-2 text-loss">{team.lost}</td>
                  <td className="text-center py-3 px-2 text-muted-foreground">{team.goalsFor}</td>
                  <td className="text-center py-3 px-2 text-muted-foreground">{team.goalsAgainst}</td>
                </>
              )}
              <td className={cn(
                'text-center py-3 px-2 font-medium',
                team.goalDifference > 0 && 'text-win',
                team.goalDifference < 0 && 'text-loss'
              )}>
                {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
              </td>
              <td className="text-center py-3 px-2 font-bold">{team.points}</td>
              {!compact && team.form && (
                <td className="py-3 px-2">
                  <div className="flex items-center justify-center gap-1">
                    {team.form.split('').slice(-5).map((result, i) => (
                      <span key={i}>{getFormBadge(result)}</span>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
