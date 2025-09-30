import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import UserCard from './UserCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCasinoSounds } from '@/hooks/useCasinoSounds';

interface LotteryCarouselProps {
  users: User[];
  onSpinComplete: (winner: User) => void;
  isSpinning: boolean;
  onStartSpin: () => void;
}

const LotteryCarousel = ({ users, onSpinComplete, isSpinning, onStartSpin }: LotteryCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const { playSpinSound, stopSpinSound } = useCasinoSounds();

  useEffect(() => {
    if (!isSpinning) {
      stopSpinSound();
      return;
    }

    playSpinSound();
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
          stopSpinSound();
          onSpinComplete(users[winnerIndex]);
          setSpinCount(0);
        }, 500);
      }
    }, 100 + Math.floor(count / 3) * 50); // Gradually slow down

    return () => {
      clearInterval(spinInterval);
      stopSpinSound();
    };
  }, [isSpinning, users, onSpinComplete, playSpinSound, stopSpinSound]);

  const getDisplayUsers = () => {
    const displayCount = Math.min(users.length, 7); // Show up to 7 cards
    const result = [];
    
    for (let i = 0; i < displayCount; i++) {
      const index = (currentIndex + i) % users.length;
      result.push(users[index]);
    }
    return result;
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-bold text-muted-foreground mb-2">
          No more participants!
        </h2>
        <p className="text-muted-foreground">
          All users have won the lottery. Congratulations to everyone! 🎉
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Carousel Display */}
      <div className="relative overflow-hidden">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {isSpinning ? 'Spinning...' : 'Next Lucky Winner'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {users.length} participant{users.length !== 1 ? 's' : ''} remaining
          </p>
        </div>

        <div className="relative overflow-hidden mx-auto max-w-6xl">
          <div 
            className={cn(
              "flex space-x-4 transition-transform duration-300 ease-out px-8",
              isSpinning && "animate-pulse"
            )}
            style={{
              transform: isSpinning ? `translateX(-${(currentIndex * 200)}px)` : 'translateX(0px)'
            }}
          >
            {getDisplayUsers().map((user, index) => {
              const isCenter = index === Math.floor(getDisplayUsers().length / 2);
              return (
                <div
                  key={`${user.id}-${index}`}
                  className={cn(
                    "flex-shrink-0 transition-all duration-300",
                    isCenter 
                      ? "scale-110 z-10" 
                      : "scale-95 opacity-70",
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
          
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>

        {isSpinning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-4xl opacity-20 animate-spin">⟳</div>
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
            '⚡ Spin Now!'
          )}
        </Button>
      </div>
    </div>
  );
};

export default LotteryCarousel;