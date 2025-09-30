export interface User {
  id: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  isWinner?: boolean;
}

export interface LotteryState {
  users: User[];
  isSpinning: boolean;
  winner: User | null;
  nextSpinTime: Date | null;
}