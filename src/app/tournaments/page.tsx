'use client';

import { useState } from 'react';
import { Trophy, Search, GamepadIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TournamentCard } from '@/components/TournamentCard';
import { CreateTournamentDialog } from '@/components/CreateTournamentDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const games = [
  { id: 'pubg', name: 'PUBG', icon: '/placeholder.svg?height=40&width=40' },
  { id: 'lol', name: 'League of Legends', icon: '/placeholder.svg?height=40&width=40' },
  { id: 'apex', name: 'Apex Legends', icon: '/placeholder.svg?height=40&width=40' },
  { id: 'warzone', name: 'Warzone', icon: '/placeholder.svg?height=40&width=40' },
];

const platforms = [
  { id: 'playstation', name: 'PlayStation', icon: '/placeholder.svg?height=40&width=40' },
  { id: 'xbox', name: 'Xbox', icon: '/placeholder.svg?height=40&width=40' },
  { id: 'pc', name: 'PC', icon: '/placeholder.svg?height=40&width=40' },
];

export default function Tournaments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('this-week');
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [selectedFormat, setSelectedFormat] = useState('any');
  const [tournaments, setTournaments] = useState([
    {
      id: '1',
      title: 'PUBG Tournament By Red Bull',
      startDate: '2024-06-26',
      endDate: '2024-06-27',
      participants: 128,
      maxParticipants: 128,
      platform: 'playstation',
      image: '/placeholder.svg?height=300&width=400',
      isJoined: true,
    },
    {
      id: '2',
      title: 'Apex Legends Tournament By Xbox',
      startDate: '2024-06-27',
      endDate: '2024-06-29',
      participants: 64,
      maxParticipants: 64,
      platform: 'xbox',
      image: '/placeholder.svg?height=300&width=400',
      isJoined: false,
    },
  ]);

  const handleCreateTournament = (tournament: any) => {
    setTournaments([
      ...tournaments,
      {
        id: String(tournaments.length + 1),
        ...tournament,
        participants: 0,
        isJoined: false,
      },
    ]);
  };

  const handleJoinTournament = (tournamentId: string) => {
    setTournaments(tournaments.map(tournament => 
      tournament.id === tournamentId
        ? { 
            ...tournament, 
            isJoined: !tournament.isJoined,
            participants: tournament.isJoined 
              ? tournament.participants - 1 
              : tournament.participants + 1
          }
        : tournament
    ));
  };

  return (
    <div className="flex h-full bg-black text-white">
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-orange-500" />
            <h1 className="text-xl font-bold">THOR<span className="text-blue-500">NAMENT</span></h1>
          </div>
          <div className="relative w-96">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search tournaments..."
              className="w-full bg-gray-900 pl-8 border-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-centergap-2">
                <Trophy className="h-12 w-12 text-orange-500" />
                <div>
                  <h2 className="text-2xl font-bold">381 tournaments</h2>
                  <p className="text-gray-400">waiting for you</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CreateTournamentDialog onCreateTournament={handleCreateTournament} />
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-32 bg-gray-900 border-gray-800">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="next-week">Next Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-32 bg-gray-900 border-gray-800">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia">Asia</SelectItem>
                  <SelectItem value="americas">Americas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger className="w-32 bg-gray-900 border-gray-800">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Format</SelectItem>
                  <SelectItem value="1v1">1v1</SelectItem>
                  <SelectItem value="2v2">2v2</SelectItem>
                  <SelectItem value="5v5">5v5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {tournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                {...tournament}
                onJoin={() => handleJoinTournament(tournament.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-64 border-l border-gray-800 p-4">
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Games</h3>
          <div className="space-y-2">
            {games.map((game) => (
              <button
                key={game.id}
                className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-800 transition-colors duration-200"
              >
                <img src={game.icon} alt={game.name} className="w-8 h-8 rounded" />
                <span>{game.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Platforms</h3>
          <div className="space-y-2">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-800 transition-colors duration-200"
              >
                <img src={platform.icon} alt={platform.name} className="w-8 h-8 rounded" />
                <span>{platform.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

