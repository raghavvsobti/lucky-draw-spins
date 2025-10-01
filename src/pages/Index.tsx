import { QRCodeCanvas } from 'qrcode.react';
import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/user';
import { useLotteryTimer } from '@/hooks/useLotteryTimer';
import LotteryCarousel from '@/components/LotteryCarousel';
import WinnerAnnouncement from '@/components/WinnerAnnouncement';
import CountdownTimer from '@/components/CountdownTimer';
import WinnersList from '@/components/WinnersList';
import PrizesDisplay from '@/components/PrizesDisplay';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import lmLogo from "@/assets/landmark-logo.png";
import lmBlack from "@/assets/lm-black.png";
import lmWhite from "@/assets/lm-white.png";
import { useTheme } from 'next-themes';

const Index = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<User | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [recentWinners, setRecentWinners] = useState<Array<{ id: string; name: string; prize: string }>>([
    { id: '1', name: 'John Smith', prize: 'iPhone' },
    { id: '2', name: 'Sarah Johnson', prize: 'AirPods' },
    { id: '3', name: 'Mike Wilson', prize: 'Apple Watch' }
  ]);

  const prizes = ['iPhone', 'AirPods', 'Apple Watch'];

  // Fetch users from RandomUser API
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('https://randomuser.me/api/?results=20&nat=us,gb,ca,au');
      const data = await response.json();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fetchedUsers: User[] = data.results.map((result: any) => ({
        id: result.login.uuid,
        name: {
          first: result.name.first,
          last: result.name.last,
        },
        email: result.email,
      }));

      setUsers(fetchedUsers);

      toast({
        title: "Participants Loaded",
        description: `${fetchedUsers.length} users are now in the lottery!`,
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
    if (users.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    toast({
      title: "⚡ Lottery Started!",
      description: "Spinning the wheel to find our lucky winner...",
    });
  }, [users.length, isSpinning, toast]);

  // Handle spin completion
  const handleSpinComplete = useCallback((selectedWinner: User) => {
    const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
    
    setIsSpinning(false);
    setWinner(selectedWinner);
    setUsers(prev => prev.filter(user => user.id !== selectedWinner.id));
    setShowWinnerModal(true);

    // Add to recent winners (keep last 5)
    setRecentWinners(prev => [
      { id: selectedWinner.id, name: `${selectedWinner.name.first} ${selectedWinner.name.last}`, prize: randomPrize },
      ...prev
    ].slice(0, 5));

    // Auto-close winner modal after 120 seconds
    setTimeout(() => {
      setShowWinnerModal(false);
      setWinner(null);
    }, 120000);
  }, [prizes]);

  // Timer for automatic spins
  const { timeUntilSpin, formattedTime, resetTimer } = useLotteryTimer(handleSpin);

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const { theme } = useTheme();

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm flex-shrink-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img src={theme === "dark" ? lmWhite : lmBlack} className='h-16 w-fit mr-0' />
            <div className="text-center flex-1 -ml-40">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary flex justify-center to-secondary bg-clip-text text-transparent">
                {/* <img src={lmLogo} className='h-10 w-10' /> */}
                Lucky Draw
              </h1>
              <p className="text-muted-foreground text-xs">
                Every 2 hours, one lucky participant wins a gift!
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>

      </header>

      <main className="flex-1 container mx-auto px-4 py-3 flex flex-col space-y-3 overflow-hidden">
        {/* Top Row: Timer and Stats */}
        <div className="flex items-center justify-between gap-4 flex-shrink-0">
          <CountdownTimer
            timeUntilSpin={timeUntilSpin}
            formattedTime={formattedTime}
            onClick={handleSpin}
          />

          <PrizesDisplay />

          <WinnersList winners={recentWinners} />
        </div>

        {/* Main Lottery Carousel */}
        <section className="py-20 flex flex-col justify-center min-h-0">
          <LotteryCarousel
            users={users}
            onSpinComplete={handleSpinComplete}
            isSpinning={isSpinning}
          />
        </section>

        {/* Registration QR Code */}
        <section className="absolute bottom-0 right-10 max-w-screen pb-4">
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center justify-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-xs">
                <QRCodeCanvas value="https://reactjs.org/" className='p-2' />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-card-foreground">
                  Want to participate?
                </p>
                <p className="text-xs text-muted-foreground">
                  Scan now to register for the next lucky draw
                </p>
              </div>
            </div>
          </Card>
        </section>
      </main>

      {/* Winner Announcement Modal */}
      {
        showWinnerModal && winner && (
          <WinnerAnnouncement winner={winner} />
        )
      }
    </div >
  );
};

export default Index;
