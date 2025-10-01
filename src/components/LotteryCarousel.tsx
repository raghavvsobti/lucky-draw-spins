import { useState, useEffect, useRef } from 'react';
import { User } from '@/types/user';
import UserCard from './UserCard';
import { cn } from '@/lib/utils';
import { useCasinoSounds } from '@/hooks/useCasinoSounds';

interface LotteryCarouselProps {
  users: User[];
  onSpinComplete: (winner: User) => void;
  isSpinning: boolean;
}

const LotteryCarousel = ({ users, onSpinComplete, isSpinning }: LotteryCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const { playSpinSound, stopSpinSound } = useCasinoSounds();
  const backgroundIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Continuous background rotation
  useEffect(() => {
    if (users.length === 0) return;

    // Fast continuous rotation
    backgroundIntervalRef.current = setInterval(() => {
      if (!isSpinning) {
        setCurrentIndex(prev => (prev + 1) % users.length);
      }
    }, 300);

    return () => {
      if (backgroundIntervalRef.current) {
        clearInterval(backgroundIntervalRef.current);
      }
    };
  }, [users.length, isSpinning]);

  // Fast spin animation when triggered
  useEffect(() => {
    if (!isSpinning) {
      stopSpinSound();
      return;
    }

    playSpinSound();
    const maxSpins = 15 + Math.floor(Math.random() * 10); // 15-25 spins
    let count = 0;

    spinIntervalRef.current = setInterval(() => {
      count++;
      setSpinCount(count);
      
      if (count <= maxSpins) {
        setCurrentIndex(prev => (prev + 1) % users.length);
      } else {
        if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
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
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
      stopSpinSound();
    };
  }, [isSpinning, users, onSpinComplete, playSpinSound, stopSpinSound]);

  const getDisplayUsers = () => {
    // Create seamless loop by tripling the users array
    const displayCount = Math.min(users.length * 3, 21); // Show up to 21 cards for seamless scroll
    const result = [];
    
    for (let i = 0; i < displayCount; i++) {
      const index = (currentIndex + i) % users.length;
      result.push({ ...users[index], loopKey: i });
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
    <div className="space-y-3">
      {/* Carousel Display */}
      <div className="relative overflow-hidden">
        <div className="text-center mb-3">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {isSpinning ? 'Spinning...' : 'All Participants'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {users.length} participant{users.length !== 1 ? 's' : ''} remaining
          </p>
        </div>

        <div className="relative overflow-hidden mx-auto max-w-6xl">
          <div 
            className={cn(
              "flex space-x-4 transition-transform ease-linear",
              isSpinning ? "duration-100" : "duration-[300ms]"
            )}
            style={{
              transform: `translateX(-${(currentIndex * 220)}px)`
            }}
          >
            {getDisplayUsers().map((user, index) => (
              <div
                key={`${user.id}-${user.loopKey}-${index}`}
                className={cn(
                  "flex-shrink-0",
                  isSpinning && "blur-sm"
                )}
              >
                <UserCard
                  user={user}
                  isSpinning={isSpinning}
                  className="w-52 h-64"
                />
              </div>
            ))}
          </div>
          
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>

        {isSpinning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-4xl opacity-20 animate-spin">⟳</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LotteryCarousel;