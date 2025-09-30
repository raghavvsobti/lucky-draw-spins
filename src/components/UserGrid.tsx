import { User } from '@/types/user';
import UserCard from './UserCard';

interface UserGridProps {
  users: User[];
  winner: User | null;
}

const UserGrid = ({ users, winner }: UserGridProps) => {
  if (users.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-card-foreground mb-2">
          All Participants
        </h2>
        <p className="text-muted-foreground">
          {users.length} user{users.length !== 1 ? 's' : ''} in the lottery
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            isWinner={winner?.id === user.id}
          />
        ))}
      </div>
    </div>
  );
};

export default UserGrid;