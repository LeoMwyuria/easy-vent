import { Dispatch, SetStateAction } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface Schedule {
  [key: string]: {
    time: string;
    room: string;
    subject: string;
    group: string;
    lecturer: string;
    additionalInfo: string;
  }[];
}

interface ScheduleButtonProps {
  onScheduleUpdate: Dispatch<SetStateAction<Schedule | null>>;
  onLoadingChange: Dispatch<SetStateAction<boolean>>;
  onError: Dispatch<SetStateAction<string | null>>;
  hasExistingSchedule?: boolean;
}

export function ScheduleButton({ 
  onScheduleUpdate, 
  onLoadingChange, 
  onError,
  hasExistingSchedule 
}: ScheduleButtonProps) {
  const { user } = useAuth();

  const handleClick = async () => {
    if (!user?.uid) {
      onError('Please sign in first');
      return;
    }

    onLoadingChange(true);
    onError(null);
    console.log('Starting schedule fetch with user:', user.uid);

    try {
      const response = await fetch('/api/schedule', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`,
          'userId': user.uid
        }
      });

      const data = await response.json();
      console.log('Received schedule data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch schedule');
      }

      if (data.schedule) {
        onScheduleUpdate(data.schedule);
        console.log('Schedule updated successfully');
      }

    } catch (err) {
      console.error('Fetch error:', err);
      onError('Failed to load schedule');
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
      disabled={!user?.uid}
    >
      {hasExistingSchedule ? 'განაახლე ცხრილი' : 'მიიღე ცხრილი'}
    </button>
  );
}