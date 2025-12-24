import { cn } from '@/lib/utils';
import { 
  Activity, 
  BarChart3, 
  Calendar, 
  Globe2, 
  Home, 
  Trophy,
  Menu,
  X,
  RefreshCw
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Tab = 'live' | 'today' | 'leagues' | 'standings' | 'predictions';

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  liveCount: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: Date | null;
}

export function Header({ 
  activeTab, 
  onTabChange, 
  liveCount,
  onRefresh,
  isRefreshing,
  lastUpdated
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'live' as Tab, label: 'Canlı', icon: Activity, badge: liveCount },
    { id: 'today' as Tab, label: 'Bugün', icon: Calendar },
    { id: 'leagues' as Tab, label: 'Ligler', icon: Globe2 },
    { id: 'standings' as Tab, label: 'Puan Durumu', icon: Trophy },
    { id: 'predictions' as Tab, label: 'Tahminler', icon: BarChart3 },
  ];

  const handleTabClick = (tab: Tab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-xl">⚽</span>
            </div>
            <div>
              <h1 className="font-display text-xl tracking-wider">FUTBOL</h1>
              <p className="text-[10px] text-muted-foreground -mt-1">GLOBAL DATA SYSTEM</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  'nav-link flex items-center gap-2 relative',
                  activeTab === tab.id && 'active'
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-live text-[10px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="hidden sm:block text-xs text-muted-foreground">
                Son güncelleme: {lastUpdated.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={isRefreshing}
              className={cn(isRefreshing && 'animate-spin')}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="grid grid-cols-2 gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg transition-all',
                    activeTab === tab.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-secondary/30 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-live text-[10px] font-bold flex items-center justify-center text-foreground">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
