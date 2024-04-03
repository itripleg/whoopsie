import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { useState, useEffect } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export function useAuth() {
  const { user } = useKindeBrowserClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  return { user, isAuthenticated };
}

export function formatDateTimeLocal(date: any) {
  const formatted = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  return formatted;
}

export function useWhoopsieForm() {
  const [level, setLevel] = useState(1);
  const [timestamp, setTimestamp] = useState(formatDateTimeLocal(new Date()));
  const [details, setDetails] = useState("");
  const [image, setImage] = useState(null);

  return {
    level,
    setLevel,
    timestamp,
    setTimestamp,
    details,
    setDetails,
    image,
    setImage,
  };
}

import { db, storage } from "../firebaseConfig";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { whoopsieLevels } from "./whoopsieLevels";

export async function addWhoopsie({
  user,
  level,
  timestamp,
  details,
  imageFile,
}: any) {
  try {
    const docRef = await addDoc(collection(db, "whoopsies"), {
      userId: user.id, // Use the appropriate user identifier
      level: whoopsieLevels[level].name,
      timestamp,
      details,
      firstName: user.given_name,
      lastName: user.family_name,
      // email: user.email,
    });
    if (imageFile) {
      const storageRef = ref(storage, `whoopsie_images/${imageFile}`);
      await uploadBytes(storageRef, imageFile);
      const url = await getDownloadURL(storageRef);
      //update doc with the download url
      try {
        await updateDoc(doc(db, "whoopsies", docRef.id), {
          image: url,
        });
      } catch (err) {
        console.log(err);
      }
    }
    console.log("Whoopsie added successfully");
    // Reset form fields or handle success state
    // setDetails("");
    // setTimestamp(formatDateTimeLocal(new Date())); // Reset to current time
    // setLevel(1); // Reset to default level
  } catch (error) {
    console.error("Error adding whoopsie: ", error);
  }
}

export async function uploadWhoopsieImage(image: any, docId: any) {
  // Implementation to upload image to Firebase Storage and update Firestore document
}
