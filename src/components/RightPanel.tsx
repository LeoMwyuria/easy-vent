import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Music, Mountain, Utensils, Palette } from 'lucide-react';

export default function RightPanel() {
  const stories = [
    {
      name: 'Sarah Chen',
      image: '/placeholder.svg?height=100&width=100',
      avatar: '/placeholder.svg?height=32&width=32'
    },
    {
      name: 'Alex Kim',
      image: '/placeholder.svg?height=100&width=100',
      avatar: '/placeholder.svg?height=32&width=32'
    }
  ];

  const suggestions = [
    {
      name: 'Nick Shelburne',
      avatar: '/placeholder.svg?height=40&width=40',
      mutual: 12
    },
    {
      name: 'Brittni Lando',
      avatar: '/placeholder.svg?height=40&width=40',
      mutual: 8
    },
    {
      name: 'Ivan Shevchenko',
      avatar: '/placeholder.svg?height=40&width=40',
      mutual: 5
    }
  ];

  const recommendations = [
    { icon: Palette, label: 'UI/UX', color: 'bg-blue-100 text-blue-700' },
    { icon: Music, label: 'Music', color: 'bg-pink-100 text-pink-700' },
    { icon: Utensils, label: 'Cooking', color: 'bg-amber-100 text-amber-700' },
    { icon: Mountain, label: 'Hiking', color: 'bg-violet-100 text-violet-700' }
  ];

  return (
    <div className="w-[380px] border-l bg-white dark:bg-gray-800 h-full">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-8">
          <section>
            <h3 className="font-semibold mb-4 text-lg">Stories</h3>
            <div className="grid grid-cols-2 gap-4">
              {stories.map((story, i) => (
                <div key={i} className="relative group cursor-pointer">
                  <div className="relative h-40 rounded-xl overflow-hidden">
                    <img
                      src={story.image}
                      alt=""
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute bottom-2 left-2 flex items-center">
                    <Avatar className="w-8 h-8 border-2 border-white">
                      <AvatarImage src={story.avatar} />
                      <AvatarFallback>{story.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="ml-2 text-white text-sm font-medium drop-shadow-lg">
                      {story.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-semibold mb-4 text-lg">Suggestions</h3>
            <div className="space-y-4">
              {suggestions.map((suggestion, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={suggestion.avatar} />
                      <AvatarFallback>{suggestion.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{suggestion.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {suggestion.mutual} mutual friends
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-semibold mb-4 text-lg">Recommendations</h3>
            <div className="grid grid-cols-2 gap-4">
              {recommendations.map((item, i) => (
                <div
                  key={i}
                  className={`${item.color} rounded-xl p-4 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:opacity-90 transition-opacity`}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}
