"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Heart, Eye } from "lucide-react";

// Define interfaces for different content types
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  createdAt: any;
  userId: string;
  authorName?: string;
  authorAvatar?: string;
}

interface Idea {
  id: string;
  text: string;
  votes: number;
  createdAt: any;
  userId: string;
  authorName?: string;
  authorAvatar?: string;
}

interface Artwork {
  id: string;
  url: string;
  name: string;
  createdAt: any;
  userId: string;
  authorName?: string;
  authorAvatar?: string;
}

interface Tournament {
  id: string;
  title: string;
  description: string;
  date: string;
  createdAt: any;
  userId: string;
  authorName?: string;
  authorAvatar?: string;
}

// Add a helper function for getting initials safely
const getInitials = (name?: string) => {
  return name ? name[0].toUpperCase() : "?";
};

export default function Home() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch recent events
        const eventsQuery = query(
          collection(db, "events"),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const eventsSnapshot = await getDocs(eventsQuery);
        const eventsData = eventsSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Event)
        );

        // Fetch popular ideas
        const ideasQuery = query(
          collection(db, "ideas"),
          orderBy("votes", "desc"),
          limit(3)
        );
        const ideasSnapshot = await getDocs(ideasQuery);
        const ideasData = ideasSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Idea)
        );

        // Fetch recent artworks
        const artworksQuery = query(
          collection(db, "artworks"),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const artworksSnapshot = await getDocs(artworksQuery);
        const artworksData = artworksSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Artwork)
        );

        // Fetch upcoming tournaments
        const tournamentsQuery = query(
          collection(db, "tournaments"),
          orderBy("date", "asc"),
          limit(3)
        );
        const tournamentsSnapshot = await getDocs(tournamentsQuery);
        const tournamentsData = tournamentsSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Tournament)
        );

        setEvents(eventsData);
        setIdeas(ideasData);
        setArtworks(artworksData);
        setTournaments(tournamentsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching content:", error);
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">News Feed</h1>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="ideas">Ideas</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Events */}
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <Avatar>
                  <AvatarImage src={event.authorAvatar} />
                  <AvatarFallback>
                    {getInitials(event.authorName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p>{event.description}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  📍 {event.location}
                </p>
              </CardContent>
            </Card>
          ))}

          {/* Ideas */}
          {ideas.map((idea) => (
            <Card key={idea.id}>
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <Avatar>
                  <AvatarImage src={idea.authorAvatar} />
                  <AvatarFallback>
                    {getInitials(idea.authorName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {idea.authorName || "Anonymous"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Idea Submission
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p>{idea.text}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  {idea.votes} votes
                </Button>
              </CardFooter>
            </Card>
          ))}

          {/* Artworks */}
          {artworks.map((artwork) => (
            <Card key={artwork.id}>
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <Avatar>
                  <AvatarImage src={artwork.authorAvatar} />
                  <AvatarFallback>
                    {getInitials(artwork.authorName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{artwork.name}</p>
                  <p className="text-sm text-muted-foreground">
                    by {artwork.authorName || "Anonymous"}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <img
                  src={artwork.url}
                  alt={artwork.name}
                  className="w-full rounded-lg"
                />
              </CardContent>
            </Card>
          ))}

          {/* Tournaments */}
          {tournaments.map((tournament) => (
            <Card key={tournament.id}>
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <Avatar>
                  <AvatarImage src={tournament.authorAvatar} />
                  <AvatarFallback>
                    {getInitials(tournament.authorName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{tournament.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {tournament.date}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p>{tournament.description}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Add separate tab contents for filtered views */}
        <TabsContent value="events" className="space-y-4">
          {/* Events only */}
        </TabsContent>
        <TabsContent value="ideas" className="space-y-4">
          {/* Ideas only */}
        </TabsContent>
        <TabsContent value="gallery" className="space-y-4">
          {/* Gallery only */}
        </TabsContent>
        <TabsContent value="tournaments" className="space-y-4">
          {/* Tournaments only */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
