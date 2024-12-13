import { SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from './ModeToggle';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <SidebarTrigger />
      <ModeToggle />
    </nav>
  );
}

