import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import UserCard from './UserCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LotteryCarouselProps {
  users: User[];
  onSpinComplete: (winner: User) => void;
  isSpinning: boolean;
  onStartSpin: () => void;
}

const LotteryCarousel = ({ users, onSpinComplete, isSpinning, onStartSpin }: LotteryCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [spinCount, setSpinCount] = useState(0);

  useEffect(() => {
    if (!isSpinning) return;

    const maxSpins = 15 + Math.floor(Math.random() * 10); // 15-25 spins
    let count = 0;

    const spinInterval = setInterval(() => {
      count++;
      setSpinCount(count);
      
      if (count <= maxSpins) {
        setCurrentIndex(prev => (prev + 1) % users.length);
      } else {
        clearInterval(spinInterval);
        // Select random winner
        const winnerIndex = Math.floor(Math.random() * users.length);
        setCurrentIndex(winnerIndex);
        
        // Delay to show the final result
        setTimeout(() => {
          onSpinComplete(users[winnerIndex]);
          setSpinCount(0);
        }, 500);
      }
    }, 100 + Math.floor(count / 3) * 50); // Gradually slow down

    return () => clearInterval(spinInterval);
  }, [isSpinning, users, onSpinComplete]);

  const getDisplayUsers = () => {
    if (users.length <= 3) return users;
    
    const result = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + users.length) % users.length;
      result.push(users[index]);
    }
    return result;
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-muted-foreground mb-4">
          No more participants!
        </h2>
        <p className="text-muted-foreground">
          All users have won the lottery. Congratulations to everyone! 🎉
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Carousel Display */}
      <div className="relative overflow-hidden">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {isSpinning ? 'Spinning...' : 'Next Lucky Winner'}
          </h2>
          <p className="text-muted-foreground mt-2">
            {users.length} participant{users.length !== 1 ? 's' : ''} remaining
          </p>
        </div>

        <div className="flex justify-center items-center space-x-4 min-h-[200px]">
          {getDisplayUsers().map((user, index) => {
            const isCenter = index === Math.floor(getDisplayUsers().length / 2);
            return (
              <div
                key={`${user.id}-${index}`}
                className={cn(
                  "transition-all duration-300",
                  isCenter 
                    ? "scale-110 z-10" 
                    : "scale-90 opacity-50",
                  isSpinning && "blur-sm"
                )}
              >
                <UserCard
                  user={user}
                  isSpinning={isSpinning}
                  className={cn(
                    "w-48",
                    isCenter && "ring-2 ring-primary shadow-lg shadow-primary/25"
                  )}
                />
              </div>
            );
          })}
        </div>

        {isSpinning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-6xl opacity-20 animate-spin">🎰</div>
          </div>
        )}
      </div>

      {/* Manual Spin Button */}
      <div className="text-center">
        <Button
          onClick={onStartSpin}
          disabled={isSpinning || users.length === 0}
          size="lg"
          className={cn(
            "bg-gradient-to-r from-primary to-secondary",
            "hover:from-primary/90 hover:to-secondary/90",
            "text-white font-bold px-8 py-4 text-lg",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-300 hover:scale-105"
          )}
        >
          {isSpinning ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Spinning...
            </>
          ) : (
            '🎰 Spin Now!'
          )}
        </Button>
      </div>
    </div>
  );
};

export default LotteryCarousel;