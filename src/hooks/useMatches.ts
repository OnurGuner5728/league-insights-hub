import { useState, useEffect, useCallback } from 'react';
import { Match } from '@/types/football';
import { getAllMatches, getLiveMatches } from '@/lib/espn-api';

interface UseMatchesOptions {
  liveOnly?: boolean;
  refreshInterval?: number;
  date?: Date;
}

interface UseMatchesReturn {
  matches: Match[];
  liveMatches: Match[];
  upcomingMatches: Match[];
  finishedMatches: Match[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useMatches(options: UseMatchesOptions = {}): UseMatchesReturn {
  const { refreshInterval = 30000, date } = options;
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      setError(null);
      const data = await getAllMatches(date);
      setMatches(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Maçlar yüklenirken bir hata oluştu');
      console.error('Error fetching matches:', err);
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchMatches();
    
    const interval = setInterval(fetchMatches, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchMatches, refreshInterval]);

  const liveMatches = matches.filter(m => m.status === 'in');
  const upcomingMatches = matches.filter(m => m.status === 'pre');
  const finishedMatches = matches.filter(m => m.status === 'post');

  return {
    matches,
    liveMatches,
    upcomingMatches,
    finishedMatches,
    isLoading,
    error,
    refetch: fetchMatches,
    lastUpdated,
  };
}

export function useLiveMatches(refreshInterval: number = 15000) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      setError(null);
      const data = await getLiveMatches();
      setMatches(data);
    } catch (err) {
      setError('Canlı maçlar yüklenirken bir hata oluştu');
      console.error('Error fetching live matches:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchMatches, refreshInterval]);

  return { matches, isLoading, error, refetch: fetchMatches };
}
