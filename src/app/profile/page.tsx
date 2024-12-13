"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Define an interface for the profile data structure
interface ProfileData {
  followers: number;
  activityPoints: number;
  activityHistory: string[];
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // Type cast the data to ProfileData
          setProfile(docSnap.data() as ProfileData);
        }
      }
    };

    fetchProfile();
  }, [user]);

  if (!user) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      {profile ? (
        <div>
          <p>Name: {user.displayName}</p>
          <p>Email: {user.email}</p>
          <p>Followers: {profile.followers}</p>
          <p>Activity Points: {profile.activityPoints}</p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Activity History</h2>
          <ul>
            {profile.activityHistory.map((activity: string, index: number) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}
