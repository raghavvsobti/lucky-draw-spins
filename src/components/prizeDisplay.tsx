import React from 'react';
import iPadImage from '@/assets/ipad-prize.jpg';
import airPodsImage from '@/assets/airpods-prize.jpg';
import watchImage from '@/assets/watch-prize.jpg';

interface Prize {
	id: string;
	name: string;
	description?: string;
	image: string;
}

const prizes: Prize[] = [
	{
		id: '1',
		name: 'iPad Pro',
		image: iPadImage
	},
	{
		id: '2',
		name: 'AirPods Pro',
		image: airPodsImage
	},
	{
		id: '3',
		name: 'Apple Watch',
		image: watchImage
	}
];

const PrizeDisplay: React.FC = () => {
	return (
		<div className="w-[52rem] h-[12rem] relative mx-6">
			{/* Background with gradient overlay */}
			<div className="absolute inset-0 bg-gradient-prize rounded-2xl" />

			{/* Glass morphism container */}
			<div className="relative w-full h-full backdrop-blur-xl bg-card-glass/50 dark:bg-card-glass/30 border border-card-glassBorder rounded-2xl shadow-card overflow-hidden">

				{/* Header section */}
				{/* <div className="absolute top-0 left-0 right-0 p-6 z-10">
					<h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
						Grand Prizes
					</h2>
					<p className="text-muted-foreground text-sm mt-1">Win amazing tech prizes</p>
				</div> */}

				{/* Prize cards container */}
				<div className="absolute inset-0 flex items-center justify-center px-8">
					<div className="grid grid-cols-3 gap-6 w-full">
						{prizes.map((prize, index) => (
							<div
								key={prize.id}
								className="group relative"
								style={{
									animationDelay: `${index * 0.1}s`
								}}
							>
								{/* Prize card */}
								<div className="relative bg-background/80 dark:bg-card-glass/50 backdrop-blur-sm rounded-xl p-4 border border-border/50 transition-all duration-500 group-hover:scale-105 group-hover:shadow-glow">

									{/* Glow effect on hover */}
									<div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-500" />

									{/* Image container */}
									<div className="relative h-20 mb-3 flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-b from-background/0 to-background/10">
										<img
											src={prize.image}
											alt={prize.name}
											className="w-full h-full object-contain transform transition-transform duration-700 group-hover:scale-110"
										/>
									</div>

									{/* Prize info */}
									<div className="relative space-y-1">
										<h3 className="font-semibold text-center text-foreground">
											{prize.name}
										</h3>
										<p className="text-sm text-muted-foreground">
											{prize.description}
										</p>
									</div>

									{/* Hover indicator */}
									<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Decorative elements */}
				<div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
				<div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
			</div>
		</div>
	);
};

export default PrizeDisplay;