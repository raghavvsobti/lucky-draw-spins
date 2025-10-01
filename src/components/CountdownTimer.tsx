import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  timeUntilSpin: number;
  formattedTime: string;
  onClick?: () => void;
}

const CountdownTimer = ({ timeUntilSpin, formattedTime, onClick }: CountdownTimerProps) => {
  const isUrgent = timeUntilSpin < 5 * 60 * 1000; // Less than 5 minutes

  return (
    <Card 
      onClick={onClick}
      className={cn(
        "p-6 text-center transition-all duration-300",
        "bg-gradient-to-r from-primary/5 to-secondary/5",
        "border-primary/20",
        isUrgent && "animate-pulse border-primary/50",
        onClick && "cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
      )}
    >
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {onClick ? 'Click to Spin or Wait' : 'Next Auto-Spin In'}
        </h3>
        <div className={cn(
          "text-3xl font-mono font-bold",
          "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",
          isUrgent && "text-destructive animate-pulse"
        )}>
          {formattedTime}
        </div>
        <p className="text-xs text-muted-foreground">
          {isUrgent ? '🔥 Spin incoming!' : 'Automatic lottery every 2 minutes'}
        </p>
      </div>
    </Card>
  );
};

export default CountdownTimer;