"use client";
import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Whoopsie from "./Whoopsie";

type Whoopsie = {
  id: string;
  level: string;
  timestamp: string;
  details: string;
  firstName?: string;
  lastName?: string;
  image?: string;
};

const AllWhoopsies: React.FC = () => {
  const [whoopsies, setWhoopsies] = useState<Whoopsie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const whoopsiesRef = query(
      collection(db, "whoopsies"),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(
      whoopsiesRef,
      (querySnapshot) => {
        const whoopsiesData: Whoopsie[] = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Whoopsie)
        );
        setWhoopsies(whoopsiesData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching whoopsies:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-white/80">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        All Whoopsies
      </h2>
      {whoopsies.length > 0 ? (
        whoopsies.map((whoopsie) => (
          <Whoopsie
            key={whoopsie.id}
            id={whoopsie.id}
            level={whoopsie.level}
            timestamp={whoopsie.timestamp}
            details={whoopsie.details}
            firstName={whoopsie.firstName}
            lastName={whoopsie.lastName}
            imageURL={whoopsie.image}
            // comments={comments}
            // likes={0}
            // likedBy={[]}
          />
        ))
      ) : (
        <p>No whoopsies found.</p>
      )}
    </div>
  );
};

export default AllWhoopsies;
