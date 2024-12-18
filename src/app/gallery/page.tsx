"use client"
import Image from 'next/image';
import { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

interface Artwork {
  id: string;
  url: string;
  name: string;
  userId?: string;
}

export default function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchArtworks = async () => {
      const querySnapshot = await getDocs(collection(db, "artworks"));
      const artworkData = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Artwork)
      );
      setArtworks(artworkData);
    };

    fetchArtworks();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !user) return;

    try {
      const storageRef = ref(storage, `artworks/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const docRef = await addDoc(collection(db, "artworks"), {
        url,
        name: title,
        userId: user.uid,
        createdAt: new Date(),
      });

      setArtworks([
        ...artworks,
        {
          id: docRef.id,
          url,
          name: title,
          userId: user.uid,
        },
      ]);

      setFile(null);
      setTitle("");
    } catch (error) {
      console.error("Error uploading artwork:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Art Gallery</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="mb-2"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Artwork title"
            className="border p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload Artwork
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="border rounded overflow-hidden">
            <Image
              src={artwork.url}
              alt={artwork.name}
              width={400} // Adjust dimensions as needed
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{artwork.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}