import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { User } from '@/types/user';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WinnerAnnouncementProps {
  winner: User;
  onClose: () => void;
}

const WinnerAnnouncement = ({ winner, onClose }: WinnerAnnouncementProps) => {
  useEffect(() => {
    // Trigger confetti
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const confettiInterval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(confettiInterval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#1CBFC3', '#073333', '#000000', '#ffffff'],
      });

      confetti({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#1CBFC3', '#073333', '#000000', '#ffffff'],
      });
    }, 250);

    // Play sound effect (using Web Audio API)
    const playWinSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    };

    playWinSound();

    return () => clearInterval(confettiInterval);
  }, []);

  const initials = `${winner.name.first.charAt(0)}${winner.name.last.charAt(0)}`.toUpperCase();
  const fullName = `${winner.name.first} ${winner.name.last}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={cn(
        "bg-card border-primary/50 max-w-md w-full",
        "animate-scale-in shadow-2xl shadow-primary/20"
      )}>
        <div className="p-8 text-center space-y-6">
          {/* Winner badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm">
            🏆 WINNER ANNOUNCEMENT
          </div>

          {/* Winner avatar */}
          <div className="flex justify-center">
            <div className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center",
              "text-3xl font-bold",
              "bg-gradient-to-br from-primary to-secondary text-white",
              "animate-winner-glow shadow-lg"
            )}>
              {initials}
            </div>
          </div>

          {/* Winner details */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-card-foreground">
              Congratulations!
            </h2>
            <h3 className="text-xl font-semibold text-primary">
              {fullName}
            </h3>
            <p className="text-muted-foreground">
              {winner.email}
            </p>
          </div>

          {/* Prize announcement */}
          <div className={cn(
            "p-4 rounded-lg border-2 border-primary/30",
            "bg-gradient-to-r from-primary/10 to-secondary/10"
          )}>
            <div className="text-lg font-bold text-card-foreground">
              🎁 You've won an
            </div>
            <div className="text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              iPhone 17 Pro
            </div>
          </div>

          {/* Close button */}
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-primary/50 hover:bg-primary/10"
          >
            Awesome! 🎉
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default WinnerAnnouncement;