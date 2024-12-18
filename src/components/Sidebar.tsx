import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Newspaper, Calendar, Trophy, LightbulbIcon, ImageIcon, Settings, LogIn, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const routes = [
    {
      label: 'News Feed',
      icon: Newspaper,
      href: '/',
      color: 'text-sky-500'
    },
    {
      label: 'Events',
      icon: Calendar,
      href: '/events',
      color: 'text-violet-500',
    },
    {
      label: 'Idea Hub',
      icon: LightbulbIcon,
      color: 'text-pink-700',
      href: '/idea-hub',
    },
    {
      label: 'Tournaments',
      icon: Trophy,
      color: 'text-orange-700',
      href: '/tournaments',
    },
    {
      label: 'Gallery',
      icon: ImageIcon,
      color: 'text-emerald-500',
      href: '/gallery',
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/settings',
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white dark:bg-gray-800 w-[300px] border-r">
      <div className="px-3 py-2">
        <Link href="/" className="flex items-center pl-3 mb-14">
        <Image
            src="/logo.svg"
            alt="Easyvent Logo"
            width={32}
            height={32}
            className="h-8 w-8 mr-2"
          />
          <span className="text-lg font-bold">Easyvent</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? 'secondary' : 'ghost'}
              className="w-full justify-start transition-all duration-200 hover:translate-x-1"
              asChild
            >
              <Link href={route.href}>
                <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="px-3 py-2">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarImage src={user.photoURL || ''} />
                  <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <span className="truncate">{user.displayName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/auth">
              <LogIn className="mr-2 h-4 w-4" />
              <span>Log in</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

