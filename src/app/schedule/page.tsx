'use client';

import { ScheduleButton } from '@/components/ui/ScheduleButton';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface Lesson {
  time: string;
  room: string;
  subject: string;
  group: string;
  lecturer: string;
  additionalInfo: string;
}

interface Schedule {
  [key: string]: Lesson[];
}

const dayTranslations = {
  monday: 'ორშაბათი',
  tuesday: 'სამშაბათი',
  wednesday: 'ოთხშაბათი',
  thursday: 'ხუთშაბათი',
  friday: 'პარასკევი',
  saturday: 'შაბათი'
};

export default function SchedulePage() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExistingSchedule() {
      if (user) {
        const scheduleDoc = await getDoc(doc(db, 'schedules', user.uid));
        if (scheduleDoc.exists()) {
          setSchedule(scheduleDoc.data().schedule);
        }
      }
      setLoading(false);
    }

    fetchExistingSchedule();
  }, [user]);
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ავტორიზაცია საჭიროა</h2>
          <p className="text-gray-600">გთხოვთ გაიაროთ ავტორიზაცია ცხრილის სანახავად</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="space-y-4 w-full max-w-2xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!schedule || Object.keys(schedule).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ცხრილი ვერ მოიძებნა</h2>
          <p className="text-gray-600 mb-6">დააჭირეთ ღილაკს BTU-ს ცხრილის მისაღებად</p>
          <ScheduleButton 
  onScheduleUpdate={setSchedule} 
  onLoadingChange={setLoading} 
  onError={setError} 
  hasExistingSchedule={!!schedule && Object.keys(schedule).length > 0} 
/>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
            <h1 className="text-3xl font-bold text-gray-800">ჩემი ცხრილი</h1>
            <ScheduleButton 
    onScheduleUpdate={setSchedule} 
    onLoadingChange={setLoading} 
    onError={setError} 
    hasExistingSchedule={!!schedule && Object.keys(schedule).length > 0} 
  />
  {error && (
    <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow mb-4">
      <p className="text-sm font-medium">{error}</p>
    </div>
  )}
        </div>
        
        <div className="space-y-6">
          {Object.entries(schedule).map(([day, lessons]) => (
            <div key={day} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <h2 className="text-xl font-bold p-4 bg-blue-500 text-white">
                {dayTranslations[day as keyof typeof dayTranslations]}
              </h2>
              <div className="divide-y divide-gray-200">
                {lessons.map((lesson, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-semibold text-blue-600">{lesson.time}</span>
                      <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {lesson.room}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="font-medium text-lg text-gray-800">{lesson.subject}</div>
                      <div className="text-gray-600">
                        <span className="font-medium">ჯგუფი:</span> {lesson.group}
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">ლექტორი:</span> {lesson.lecturer}
                      </div>
                      {lesson.additionalInfo && (
                        <div className="text-sm text-gray-500 mt-2 pt-2 border-t">
                          {lesson.additionalInfo}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}