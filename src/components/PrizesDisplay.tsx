import { Card } from '@/components/ui/card';
import airpodsImg from '@/assets/airpods.png';
import ipadImg from '@/assets/ipad.png';
import appleWatchImg from '@/assets/apple-watch.png';
import { motion } from 'framer-motion';

const prizes = [
  { id: 1, name: 'AirPods', image: airpodsImg },
  { id: 2, name: 'iPad', image: ipadImg },
  { id: 3, name: 'Apple Watch', image: appleWatchImg },
];

const PrizesDisplay = () => {
  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
      <h3 className="text-center text-sm font-semibold text-card-foreground mb-3">
        Grand Prizes
      </h3>
      <div className="flex items-center justify-center gap-4">
        {prizes.map((prize, index) => (
          <motion.div
            key={prize.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 p-3 flex items-center justify-center">
              <img 
                src={prize.image} 
                alt={prize.name}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {prize.name}
            </span>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default PrizesDisplay;
