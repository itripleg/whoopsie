// MyWhoopsies.tsx
"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/firebaseConfig"; // Ensure this path is correct
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { query, collection, where, onSnapshot } from "firebase/firestore";
import Whoopsie from "@/components/Whoopsie"; // Adjust the import path as necessary

interface WhoopsieProps {
  id: string;
  level: string;
  timestamp: string;
  details: string;
  firstName: string;
  lastName: string;
}

const MyWhoopsies: React.FC = () => {
  const { user } = useKindeBrowserClient();
  const [whoopsies, setWhoopsies] = useState<WhoopsieProps[]>([]);

  useEffect(() => {
    if (user?.id) {
      const q = query(
        collection(db, "whoopsies"),
        where("userId", "==", user.id)
      );

      // Using onSnapshot for real-time updates
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const whoopsiesData: WhoopsieProps[] = querySnapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as WhoopsieProps)
          );
          setWhoopsies(whoopsiesData);
        },
        (error) => {
          console.error("Error fetching whoopsies:", error);
        }
      );

      // Cleanup the subscription on component unmount
      return () => unsubscribe();
    }
  }, [user?.id]);

  return (
    <div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">Your Whoopsies</h2>
        {whoopsies.length > 0 ? (
          whoopsies.map((whoopsie) => (
            <Whoopsie
              key={whoopsie.id}
              id={whoopsie.id}
              level={whoopsie.level}
              timestamp={whoopsie.timestamp}
              details={whoopsie.details}
              // likes={0}
              // likedBy={[]}
              // firstName={whoopsie.firstName}
              // lastName={whoopsie.lastName}
            />
          ))
        ) : (
          <p className="text-white/20">No whoopsies found.</p>
        )}
      </div>
    </div>
  );
};

export default MyWhoopsies;
