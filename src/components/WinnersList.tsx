import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface Winner {
	id: string;
	name: string;
	prize: string;
}

interface WinnersListProps {
	winners: Winner[];
}

const WinnersList = ({ winners }: WinnersListProps) => {
	if (winners.length === 0) return null;

	return (
		<Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
			<div className="flex items-center gap-2 mb-4">
				<Trophy className="w-5 h-5 text-primary" />
				<h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
					Recent Winners
				</h3>
			</div>
			<div className="space-y-3">
				{winners.map((winner) => (
					<div
						key={winner.id}
						className="flex items-start gap-2 text-sm animate-in fade-in slide-in-from-right duration-500"
					>
						<span className="text-primary">🎉</span>
						<p className="text-muted-foreground">
							<span className="font-semibold text-foreground">{winner.name}</span> won an{' '}
							<span className="font-semibold text-primary">{winner.prize}</span>
						</p>
					</div>
				))}
			</div>
		</Card>
	);
};

export default WinnersList;
