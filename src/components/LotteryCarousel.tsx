import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [spinCount, setSpinCount] = useState(0);
  const { playSpinSound, stopSpinSound } = useCasinoSounds();
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fast spin animation when triggered
  useEffect(() => {
    if (!isSpinning) {
      stopSpinSound();
      return;
    }

    playSpinSound();
    const spinDuration = 3000 + Math.random() * 2000; // 3-5 seconds
    
    const spinTimeout = setTimeout(() => {
      stopSpinSound();
      const winnerIndex = Math.floor(Math.random() * users.length);
      onSpinComplete(users[winnerIndex]);
    }, spinDuration);

    return () => {
      clearTimeout(spinTimeout);
      stopSpinSound();
    };
  }, [isSpinning, users, onSpinComplete, playSpinSound, stopSpinSound]);

  // Create duplicated array for infinite scroll effect
  const duplicatedUsers = [...users, ...users, ...users];

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
          <motion.div 
            className="flex space-x-4"
            animate={{
              x: isSpinning ? [0, -users.length * 220] : [0, -users.length * 220]
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: isSpinning ? users.length * 0.1 : users.length * 2,
                ease: "linear"
              }
            }}
          >
            {duplicatedUsers.map((user, index) => (
              <div
                key={`${user.id}-${index}`}
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
          </motion.div>
          
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