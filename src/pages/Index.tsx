import { useState, useEffect, useCallback } from 'react';
import { User, LotteryState } from '@/types/user';
import { useLotteryTimer } from '@/hooks/useLotteryTimer';
import LotteryCarousel from '@/components/LotteryCarousel';
import WinnerAnnouncement from '@/components/WinnerAnnouncement';
import CountdownTimer from '@/components/CountdownTimer';
import UserGrid from '@/components/UserGrid';
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              🎰 Lottery Spinner
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every 2 hours, one lucky participant wins an iPhone 17 Pro! 
              Winners are automatically removed from future drawings.
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Countdown Timer */}
        <div className="max-w-md mx-auto">
          <CountdownTimer 
            timeUntilSpin={timeUntilSpin}
            formattedTime={formattedTime}
          />
        </div>

        {/* Lottery Carousel */}
        <section className="max-w-6xl mx-auto">
          <LotteryCarousel
            users={lotteryState.users}
            onSpinComplete={handleSpinComplete}
            isSpinning={lotteryState.isSpinning}
            onStartSpin={handleSpin}
          />
        </section>

        {/* All Participants Grid */}
        <section className="max-w-6xl mx-auto">
          <UserGrid 
            users={lotteryState.users}
            winner={lotteryState.winner}
          />
        </section>

        {/* Stats */}
        {lotteryState.users.length > 0 && (
          <section className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="text-2xl font-bold text-primary">{lotteryState.users.length}</div>
                <div className="text-sm text-muted-foreground">Participants</div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="text-2xl font-bold text-secondary">iPhone 17 Pro</div>
                <div className="text-sm text-muted-foreground">Prize</div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="text-2xl font-bold text-accent">2 Hours</div>
                <div className="text-sm text-muted-foreground">Spin Interval</div>
              </div>
            </div>
          </section>
        )}
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
