"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

// Define interface for idea structure
interface Idea {
  id: string;
  text: string;
  votes: number;
  userId?: string;
}

export default function IdeaHub() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [newIdea, setNewIdea] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchIdeas = async () => {
      const querySnapshot = await getDocs(collection(db, "ideas"));
      const ideasData = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Idea)
      );
      setIdeas(ideasData);
    };

    fetchIdeas();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      const docRef = await addDoc(collection(db, "ideas"), {
        text: newIdea,
        votes: 0,
        userId: user.uid,
      });

      setIdeas([...ideas, { id: docRef.id, text: newIdea, votes: 0 }]);
      setNewIdea("");
    } catch (error) {
      console.error("Error adding idea:", error);
    }
  };

  const handleVote = async (ideaId: string) => {
    if (!user) return;

    try {
      const ideaRef = doc(db, "ideas", ideaId);
      const idea = ideas.find((i) => i.id === ideaId);

      if (idea) {
        await updateDoc(ideaRef, {
          votes: idea.votes + 1,
        });

        setIdeas(
          ideas.map((idea) => {
            if (idea.id === ideaId) {
              return { ...idea, votes: idea.votes + 1 };
            }
            return idea;
          })
        );
      }
    } catch (error) {
      console.error("Error updating votes:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Idea Hub</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          value={newIdea}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewIdea(e.target.value)
          }
          placeholder="Share your idea..."
          className="border p-2 mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>

      <div className="space-y-4">
        {ideas.map((idea) => (
          <div key={idea.id} className="border p-4 rounded">
            <p className="text-lg">{idea.text}</p>
            <div className="flex items-center mt-2">
              <button
                onClick={() => handleVote(idea.id)}
                className="text-sm text-blue-500"
              >
                Votes: {idea.votes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
