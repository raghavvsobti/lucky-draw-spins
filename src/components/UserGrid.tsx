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
    <div className="space-y-3">
      <div className="text-center">
        {/* <h3 className="text-lg font-semibold text-foreground">
          All Participants ({users.length})
        </h3> */}
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-15 gap-2 max-h-40 overflow-y-auto">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            isWinner={winner?.id === user.id}
            className="h-20 text-xs hover:scale-105 transition-transform duration-200"
          />
        ))}
      </div>
    </div>
  );
};

export default UserGrid;