import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  timeUntilSpin: number;
  formattedTime: string;
}

const CountdownTimer = ({ timeUntilSpin, formattedTime }: CountdownTimerProps) => {
  const isUrgent = timeUntilSpin < 5 * 60 * 1000; // Less than 5 minutes

  return (
    <Card className={cn(
      "p-6 text-center transition-all duration-300",
      "bg-gradient-to-r from-primary/5 to-secondary/5",
      "border-primary/20",
      isUrgent && "animate-pulse border-primary/50"
    )}>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Next Auto-Spin In
        </h3>
        <div className={cn(
          "text-3xl font-mono font-bold",
          "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",
          isUrgent && "text-destructive animate-pulse"
        )}>
          {formattedTime}
        </div>
        <p className="text-xs text-muted-foreground">
          {isUrgent ? '🔥 Spin incoming!' : 'Automatic lottery every 2 hours'}
        </p>
      </div>
    </Card>
  );
};

export default CountdownTimer;