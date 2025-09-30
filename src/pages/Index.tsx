import { useState, useEffect, useCallback } from 'react';
import { User, LotteryState } from '@/types/user';
import { useLotteryTimer } from '@/hooks/useLotteryTimer';
import LotteryCarousel from '@/components/LotteryCarousel';
import WinnerAnnouncement from '@/components/WinnerAnnouncement';
import CountdownTimer from '@/components/CountdownTimer';
import UserGrid from '@/components/UserGrid';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [lotteryState, setLotteryState] = useState<LotteryState>({
    users: [],
    isSpinning: false,
    winner: null,
    nextSpinTime: null,
  });
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  // Fetch users from RandomUser API
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('https://randomuser.me/api/?results=20&nat=us,gb,ca,au');
      const data = await response.json();
      
      const users: User[] = data.results.map((result: any) => ({
        id: result.login.uuid,
        name: {
          first: result.name.first,
          last: result.name.last,
        },
        email: result.email,
      }));

      setLotteryState(prev => ({ ...prev, users }));
      
      toast({
        title: "Participants Loaded",
        description: `${users.length} users are now in the lottery!`,
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({
        title: "Error",
        description: "Failed to load participants. Please refresh the page.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Handle lottery spin
  const handleSpin = useCallback(() => {
    if (lotteryState.users.length === 0 || lotteryState.isSpinning) return;

    setLotteryState(prev => ({ ...prev, isSpinning: true, winner: null }));
    
    toast({
      title: "🎰 Lottery Started!",
      description: "Spinning the wheel to find our lucky winner...",
    });
  }, [lotteryState.users.length, lotteryState.isSpinning, toast]);

  // Handle spin completion
  const handleSpinComplete = useCallback((winner: User) => {
    setLotteryState(prev => ({
      ...prev,
      isSpinning: false,
      winner,
      users: prev.users.filter(user => user.id !== winner.id), // Remove winner from list
    }));
    
    setShowWinnerModal(true);
  }, []);

  // Handle winner modal close
  const handleWinnerModalClose = useCallback(() => {
    setShowWinnerModal(false);
    setLotteryState(prev => ({ ...prev, winner: null }));
  }, []);

  // Timer for automatic spins
  const { timeUntilSpin, formattedTime, resetTimer } = useLotteryTimer(handleSpin);

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm flex-shrink-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                🎰 Lottery Spinner
              </h1>
              <p className="text-muted-foreground text-sm">
                Every 2 minutes, one lucky participant wins an iPhone 17 Pro!
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-6 flex flex-col space-y-6 overflow-hidden">
        {/* Top Row: Timer and Stats */}
        <div className="flex items-center justify-between gap-6 flex-shrink-0">
          <CountdownTimer 
            timeUntilSpin={timeUntilSpin}
            formattedTime={formattedTime}
          />
          
          {lotteryState.users.length > 0 && (
            <div className="flex gap-4">
              <div className="bg-card px-4 py-2 rounded-lg border border-border text-center">
                <div className="text-lg font-bold text-primary">{lotteryState.users.length}</div>
                <div className="text-xs text-muted-foreground">Participants</div>
              </div>
              <div className="bg-card px-4 py-2 rounded-lg border border-border text-center">
                <div className="text-lg font-bold text-secondary">iPhone 17 Pro</div>
                <div className="text-xs text-muted-foreground">Prize</div>
              </div>
              <div className="bg-card px-4 py-2 rounded-lg border border-border text-center">
                <div className="text-lg font-bold text-accent">2 Min</div>
                <div className="text-xs text-muted-foreground">Interval</div>
              </div>
            </div>
          )}
        </div>

        {/* Main Lottery Carousel */}
        <section className="flex-1 flex flex-col justify-center min-h-0">
          <LotteryCarousel
            users={lotteryState.users}
            onSpinComplete={handleSpinComplete}
            isSpinning={lotteryState.isSpinning}
            onStartSpin={handleSpin}
          />
        </section>

        {/* Bottom Participants Grid */}
        <section className="flex-shrink-0 max-h-48 overflow-hidden">
          <UserGrid 
            users={lotteryState.users}
            winner={lotteryState.winner}
          />
        </section>
      </main>

      {/* Winner Announcement Modal */}
      {showWinnerModal && lotteryState.winner && (
        <WinnerAnnouncement
          winner={lotteryState.winner}
          onClose={handleWinnerModalClose}
        />
      )}
    </div>
  );
};

export default Index;
