import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GamepadIcon, Users } from 'lucide-react';
import Image from 'next/image';

interface TournamentCardProps {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  platform: string;
  image: string;
  isJoined: boolean;
  onJoin: () => void;
}

export function TournamentCard({
  title,
  startDate,
  endDate,
  participants,
  platform,
  image,
  isJoined,
  onJoin,
}: TournamentCardProps) {
  const formattedDate = `${new Date(startDate).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })} - ${new Date(endDate).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })}`;

  return (
    <Card className="overflow-hidden bg-gray-900 border-gray-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20">
      <div className="relative h-48">
        <Image
          src={image}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
          <div className="flex items-center justify-between text-gray-300">
            <div className="text-sm">{formattedDate}</div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-sm">{participants} Participants</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GamepadIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-400">{platform}</span>
        </div>
        <Button
          variant={isJoined ? "secondary" : "default"}
          onClick={onJoin}
          className="transition-all duration-300 hover:scale-105"
        >
          {isJoined ? 'Joined' : 'Join'}
        </Button>
      </div>
    </Card>
  );
}

