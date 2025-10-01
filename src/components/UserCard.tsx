import { User } from '@/types/user';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UserCardProps {
  user: User;
  isWinner?: boolean;
  isSpinning?: boolean;
  className?: string;
}

const UserCard = ({ user, isWinner, isSpinning, className }: UserCardProps) => {
  const initials = `${user.name.first.charAt(0)}${user.name.last.charAt(0)}`.toUpperCase();
  const fullName = `${user.name.first} ${user.name.last}`;

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300",
      "bg-card hover:bg-card/80 border-border",
      isWinner && "animate-winner-glow border-primary bg-primary/5",
      isSpinning && "animate-slot-spin",
      className
    )}>
      <div className="p-6 text-center space-y-4">
        {/* Avatar with initials */}
        <div className={cn(
          "mx-auto w-16 h-16 rounded-full flex items-center justify-center",
          "text-xl font-bold transition-all duration-300",
          "bg-gradient-to-br from-primary to-secondary text-primary-foreground",
          "group-hover:scale-110",
          isWinner && "animate-float"
        )}>
          {initials}
        </div>
        
        {/* User name */}
        <div className="space-y-1">
          <h3 className={cn(
            "font-semibold text-card-foreground transition-colors",
            "group-hover:text-primary",
            isWinner && "text-primary font-bold"
          )}>
            {fullName}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {user.email}
          </p>
        </div>

        {isWinner && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 animate-pulse" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default UserCard;