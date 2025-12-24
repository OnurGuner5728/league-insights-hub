import { useState, useMemo } from 'react';
import { Match } from '@/types/football';
import { useMatches } from '@/hooks/useMatches';
import { useStandings } from '@/hooks/useStandings';
import { Header } from '@/components/Header';
import { MatchList } from '@/components/MatchList';
import { MatchDetail } from '@/components/MatchDetail';
import { StandingsTable } from '@/components/StandingsTable';
import { LeagueSelector } from '@/components/LeagueSelector';
import { PredictionPanel } from '@/components/PredictionPanel';
import { MatchListSkeleton, StandingsTableSkeleton } from '@/components/Skeletons';
import { TOP_LEAGUES, getLeagueName, getLeagueFlag } from '@/data/leagues';
import { Button } from '@/components/ui/button';
import { Activity, Calendar, Globe2, ChevronRight, TrendingUp, Zap } from 'lucide-react';

type Tab = 'live' | 'today' | 'leagues' | 'standings' | 'predictions';

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('live');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<string>('eng.1');

  const { 
    matches, 
    liveMatches, 
    upcomingMatches,
    isLoading, 
    error, 
    refetch,
    lastUpdated 
  } = useMatches({ refreshInterval: 30000 });

  const { 
    standings, 
    isLoading: standingsLoading 
  } = useStandings(selectedLeague);

  // Group matches by status for predictions
  const predictableMatches = useMemo(() => {
    return upcomingMatches.filter(m => 
      TOP_LEAGUES.includes(m.league) && m.odds
    ).slice(0, 6);
  }, [upcomingMatches]);

  const renderContent = () => {
    switch (activeTab) {
      case 'live':
        return (
          <div className="space-y-8">
            {/* Live Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-live/20 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-live" />
                </div>
                <div>
                  <h2 className="font-display text-2xl">CANLI MAÇLAR</h2>
                  <p className="text-sm text-muted-foreground">
                    {liveMatches.length} maç şu an oynanıyor
                  </p>
                </div>
              </div>
            </div>

            {isLoading ? (
              <MatchListSkeleton />
            ) : liveMatches.length > 0 ? (
              <MatchList 
                matches={liveMatches} 
                groupByContinent 
                onMatchClick={setSelectedMatch}
              />
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                  <Activity className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl mb-2">Şu An Canlı Maç Yok</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Yaklaşan maçları görmek için "Bugün" sekmesine göz atabilirsiniz.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab('today')}
                >
                  Bugünkü Maçları Gör
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Upcoming Matches Preview */}
            {liveMatches.length > 0 && upcomingMatches.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Yaklaşan Maçlar
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('today')}>
                    Tümünü Gör
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <MatchList 
                  matches={upcomingMatches.slice(0, 4)} 
                  onMatchClick={setSelectedMatch}
                  compact
                />
              </div>
            )}
          </div>
        );

      case 'today':
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-2xl">BUGÜNÜN MAÇLARI</h2>
                <p className="text-sm text-muted-foreground">
                  {matches.length} maç bugün oynanacak
                </p>
              </div>
            </div>

            {isLoading ? (
              <MatchListSkeleton />
            ) : (
              <MatchList 
                matches={matches} 
                groupByLeague 
                onMatchClick={setSelectedMatch}
              />
            )}
          </div>
        );

      case 'leagues':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Globe2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-2xl">TÜM LİGLER</h2>
                <p className="text-sm text-muted-foreground">
                  6 kıta, 60+ lig
                </p>
              </div>
            </div>

            <LeagueSelector 
              selectedLeague={selectedLeague}
              onSelectLeague={(code) => {
                setSelectedLeague(code);
                setActiveTab('standings');
              }}
            />
          </div>
        );

      case 'standings':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getLeagueFlag(selectedLeague)}</span>
                <div>
                  <h2 className="font-display text-2xl">{getLeagueName(selectedLeague)}</h2>
                  <p className="text-sm text-muted-foreground">Puan Durumu</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveTab('leagues')}
              >
                Lig Değiştir
              </Button>
            </div>

            {/* Quick League Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {TOP_LEAGUES.map(code => (
                <Button
                  key={code}
                  variant={selectedLeague === code ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLeague(code)}
                  className="flex-shrink-0"
                >
                  <span className="mr-2">{getLeagueFlag(code)}</span>
                  {getLeagueName(code)}
                </Button>
              ))}
            </div>

            <div className="glass-card p-4">
              {standingsLoading ? (
                <StandingsTableSkeleton />
              ) : standings.length > 0 ? (
                <StandingsTable standings={standings} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Puan durumu verisi bulunamadı
                </div>
              )}
            </div>
          </div>
        );

      case 'predictions':
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-2xl">TAHMİN SİSTEMİ</h2>
                <p className="text-sm text-muted-foreground">
                  Poisson modeli ile xG bazlı tahminler
                </p>
              </div>
            </div>

            {/* Info Card */}
            <div className="glass-card p-4 border-primary/30">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Nasıl Çalışır?</h3>
                  <p className="text-sm text-muted-foreground">
                    Sistem, takımların geçmiş performansları ve form durumlarına göre xG (beklenen gol) değerlerini hesaplar. 
                    Poisson dağılımı kullanarak olasılıkları belirler ve bahis oranlarıyla karşılaştırarak değerli bahisleri tespit eder.
                  </p>
                </div>
              </div>
            </div>

            {/* Predictable Matches */}
            {predictableMatches.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-display text-lg">Analiz Edilebilir Maçlar</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {predictableMatches.map(match => (
                    <div
                      key={match.id}
                      onClick={() => setSelectedMatch(match)}
                      className="score-card cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span>{getLeagueFlag(match.league)}</span>
                        <span className="text-xs text-muted-foreground">{match.leagueName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="font-medium">{match.home.name}</div>
                          <div className="font-medium">{match.away.name}</div>
                        </div>
                        <Button size="sm" variant="outline">
                          Analiz Et
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Şu an analiz edilebilir yaklaşan maç bulunmuyor.
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        liveCount={liveMatches.length}
        onRefresh={refetch}
        isRefreshing={isLoading}
        lastUpdated={lastUpdated}
      />

      <main className="container py-6">
        {error ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-destructive/20 mx-auto flex items-center justify-center mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="font-display text-xl mb-2">Bir Hata Oluştu</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refetch}>Tekrar Dene</Button>
          </div>
        ) : (
          renderContent()
        )}
      </main>

      {/* Match Detail Modal */}
      {selectedMatch && (
        <MatchDetail 
          match={selectedMatch} 
          onClose={() => setSelectedMatch(null)} 
        />
      )}

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>🌍 Global Futbol Data System</p>
          <p className="text-xs mt-1">ESPN API • 100+ Lig • Gerçek Zamanlı Veriler</p>
        </div>
      </footer>
    </div>
  );
}
