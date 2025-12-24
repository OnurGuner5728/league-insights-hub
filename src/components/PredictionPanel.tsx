import { useState } from 'react';
import { Match, PredictionResult } from '@/types/football';
import { calculatePrediction, estimateXg, findValueBets } from '@/lib/prediction';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { TrendingUp, Target, BarChart3, Zap } from 'lucide-react';

interface PredictionPanelProps {
  match: Match;
}

export function PredictionPanel({ match }: PredictionPanelProps) {
  const [homeXg, setHomeXg] = useState(() => 
    estimateXg(match.home.form, true)
  );
  const [awayXg, setAwayXg] = useState(() => 
    estimateXg(match.away.form, false)
  );
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const handleCalculate = () => {
    const result = calculatePrediction(homeXg, awayXg);
    setPrediction(result);
  };

  const valueBets = prediction && match.odds ? findValueBets(prediction, {
    home: match.odds.homeOdds,
    draw: match.odds.drawOdds,
    away: match.odds.awayOdds,
  }) : [];

  return (
    <div className="space-y-6">
      {/* xG Adjustment */}
      <div className="glass-card p-4">
        <h4 className="font-display text-lg mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          xG Değerleri
        </h4>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{match.home.name}</span>
              <span className="text-lg font-bold text-primary">{homeXg.toFixed(2)}</span>
            </div>
            <Slider
              value={[homeXg]}
              onValueChange={([v]) => setHomeXg(v)}
              min={0.5}
              max={4}
              step={0.1}
              className="py-2"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{match.away.name}</span>
              <span className="text-lg font-bold text-primary">{awayXg.toFixed(2)}</span>
            </div>
            <Slider
              value={[awayXg]}
              onValueChange={([v]) => setAwayXg(v)}
              min={0.5}
              max={4}
              step={0.1}
              className="py-2"
            />
          </div>
        </div>

        <Button onClick={handleCalculate} className="w-full mt-4" size="lg">
          <Zap className="w-4 h-4 mr-2" />
          Tahmin Hesapla
        </Button>
      </div>

      {/* Prediction Results */}
      {prediction && (
        <>
          {/* 1X2 Probabilities */}
          <div className="glass-card p-4 animate-slide-up">
            <h4 className="font-display text-lg mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              1X2 Olasılıkları
            </h4>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-win mb-1">
                  %{prediction.probabilities.homeWin}
                </div>
                <div className="text-xs text-muted-foreground">Ev Sahibi</div>
                <div className="text-sm font-medium mt-2">
                  @{prediction.impliedOdds.home}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-draw mb-1">
                  %{prediction.probabilities.draw}
                </div>
                <div className="text-xs text-muted-foreground">Beraberlik</div>
                <div className="text-sm font-medium mt-2">
                  @{prediction.impliedOdds.draw}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-loss mb-1">
                  %{prediction.probabilities.awayWin}
                </div>
                <div className="text-xs text-muted-foreground">Deplasman</div>
                <div className="text-sm font-medium mt-2">
                  @{prediction.impliedOdds.away}
                </div>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="mt-4 h-3 rounded-full overflow-hidden flex">
              <div 
                className="bg-win h-full transition-all"
                style={{ width: `${prediction.probabilities.homeWin}%` }}
              />
              <div 
                className="bg-draw h-full transition-all"
                style={{ width: `${prediction.probabilities.draw}%` }}
              />
              <div 
                className="bg-loss h-full transition-all"
                style={{ width: `${prediction.probabilities.awayWin}%` }}
              />
            </div>
          </div>

          {/* Over/Under */}
          <div className="glass-card p-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h4 className="font-display text-lg mb-4">Alt/Üst Gol</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Üst 0.5', value: prediction.overUnder.over05 },
                { label: 'Üst 1.5', value: prediction.overUnder.over15 },
                { label: 'Üst 2.5', value: prediction.overUnder.over25 },
                { label: 'Üst 3.5', value: prediction.overUnder.over35 },
              ].map(item => (
                <div key={item.label} className="bg-secondary/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold">%{item.value}</div>
                    <div className="stat-bar flex-1 ml-3">
                      <div 
                        className="stat-bar-fill" 
                        style={{ width: `${item.value}%` }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Beklenen Toplam Gol</span>
                <span className="text-xl font-bold text-primary">{prediction.expectedGoals}</span>
              </div>
            </div>
          </div>

          {/* BTTS */}
          <div className="glass-card p-4 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <h4 className="font-display text-lg mb-4">Karşılıklı Gol (KG)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-win/10 border border-win/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-win">%{prediction.btts.yes}</div>
                <div className="text-sm text-muted-foreground">KG Var</div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">%{prediction.btts.no}</div>
                <div className="text-sm text-muted-foreground">KG Yok</div>
              </div>
            </div>
          </div>

          {/* Top Scores */}
          <div className="glass-card p-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h4 className="font-display text-lg mb-4">En Olası Skorlar</h4>
            <div className="grid grid-cols-5 gap-2">
              {prediction.topScores.map((score, i) => (
                <div 
                  key={score.score}
                  className={cn(
                    'rounded-lg p-3 text-center transition-all',
                    i === 0 ? 'bg-primary/20 border border-primary/50' : 'bg-secondary/50'
                  )}
                >
                  <div className="font-display text-xl">{score.score}</div>
                  <div className="text-xs text-muted-foreground">%{score.prob}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Value Bets */}
          {valueBets.length > 0 && (
            <div className="glass-card p-4 border-win/30 animate-slide-up" style={{ animationDelay: '0.25s' }}>
              <h4 className="font-display text-lg mb-4 flex items-center gap-2 text-win">
                <TrendingUp className="w-5 h-5" />
                Değerli Bahisler
              </h4>
              <div className="space-y-3">
                {valueBets.map(bet => (
                  <div key={bet.market} className="bg-win/10 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{bet.market}</span>
                      <span className="text-win font-bold">+{bet.value}% Değer</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>
                        <span className="block">Bizim Olasılık</span>
                        <span className="text-foreground font-medium">%{bet.ourProb}</span>
                      </div>
                      <div>
                        <span className="block">Bahisçi Odds</span>
                        <span className="text-foreground font-medium">@{bet.bookieOdds}</span>
                      </div>
                      <div>
                        <span className="block">Kelly %</span>
                        <span className="text-win font-medium">{bet.kelly}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
