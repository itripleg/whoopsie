//dashboard.tsx
"use client";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig.js";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { LoginLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import MyWhoopsies from "./MyWhoopsies";
import LoginWidget from "@/components/LoginWidget";
import { whoopsieLevels } from "@/util/whoopsieLevels";

export default function Dashboard() {
  const router = useRouter();
  const formatDateTimeLocal = (date: any) => {
    const formatted = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);
    return formatted;
  };

  const { user } = useKindeBrowserClient();
  const [level, setLevel] = useState(1); // Default to "Whoops"
  const [timestamp, setTimestamp] = useState(formatDateTimeLocal(new Date())); // Set default timestamp to today's date
  const [details, setDetails] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user || details.trim() === "" || timestamp.trim() === "") {
      console.log("Missing user information or required fields are empty");
      return;
    }

    try {
      await addDoc(collection(db, "whoopsies"), {
        userId: user.id, // Use the appropriate user identifier
        level: whoopsieLevels[level].name,
        timestamp,
        details,
        firstName: user.given_name,
        lastName: user.family_name,
        // email: user.email,
      });
      console.log("Whoopsie added successfully");
      // Reset form fields or handle success state
      setDetails("");
      setTimestamp(formatDateTimeLocal(new Date())); // Reset to current time
      setLevel(1); // Reset to default level
    } catch (error) {
      console.error("Error adding whoopsie: ", error);
    }
  };

  if (!user) {
    return <LoginWidget />;
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-800 p-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-white">Add New Whoopsie</h2>

        <div>
          <motion.div
            key={level} // Changing the key will re-trigger the animation
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-4"
          >
            <div className="text-lg font-medium text-blue-600">
              {whoopsieLevels[level].name}
            </div>
            <p className="text-sm text-gray-500">
              {whoopsieLevels[level].description}
            </p>
          </motion.div>
          <input
            type="range"
            min="0"
            max="9"
            value={level}
            // @ts-ignore
            onChange={(e) => setLevel(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs mt-2">
            {whoopsieLevels.map((item, index) => (
              <span
                key={index}
                className={`hidden md:flex w-20 text-center ${
                  index == level ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="timestamp"
            className="block text-sm font-medium text-gray-500"
          >
            When did it happen?
          </label>
          <input
            type="datetime-local"
            id="timestamp"
            name="timestamp"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block  shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          />
        </div>

        <div>
          <label
            htmlFor="details"
            className="block text-sm font-medium text-gray-500"
          >
            Details
          </label>
          <textarea
            id="details"
            name="details"
            rows={4}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2 md:text-lg"
          ></textarea>
        </div>
        <div className="flex justify-between">
          <button
            onClick={async () => {
              router.push("/");
              await fetch("/api/generate-whoopsie/");
            }}
            className="px-4 py-2 bg-pink-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          >
            Generate 🤖 Whoopsie
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          >
            Submit
          </button>
        </div>
        <MyWhoopsies />
      </form>
    </motion.div>
  );
}
