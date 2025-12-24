import { useState, useEffect, useCallback } from 'react';
import { Standing } from '@/types/football';
import { getLeagueStandings } from '@/lib/espn-api';

export function useStandings(leagueCode: string) {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStandings = useCallback(async () => {
    if (!leagueCode) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await getLeagueStandings(leagueCode);
      setStandings(data);
    } catch (err) {
      setError('Puan durumu yüklenirken bir hata oluştu');
      console.error('Error fetching standings:', err);
    } finally {
      setIsLoading(false);
    }
  }, [leagueCode]);

  useEffect(() => {
    fetchStandings();
  }, [fetchStandings]);

  return { standings, isLoading, error, refetch: fetchStandings };
}
