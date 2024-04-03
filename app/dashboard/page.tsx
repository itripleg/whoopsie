//dashboard.tsx
"use client";
import { Camera } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import MyWhoopsies from "./MyWhoopsies";
import { whoopsieLevels } from "@/lib/whoopsieLevels";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import Image from "next/image.js";
import { addWhoopsie, formatDateTimeLocal } from "@/lib/utils";
import LoginWidget from "@/components/LoginWidget";
import ImagePreview from "@/components/ImagePreview";

export default function Dashboard() {
  const { user } = useKindeBrowserClient();
  const [level, setLevel] = useState(1); // Default to "Whoops"
  const [timestamp, setTimestamp] = useState(formatDateTimeLocal(new Date())); // Set default timestamp to today's date
  const [details, setDetails] = useState("");
  const [imageFile, setImageFile] = useState<File>();
  const [imageURL, setImageURL] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImageURL = URL.createObjectURL(file);
      setImageURL(newImageURL); // Set the selected image URL to state.
      setImageFile(file); // Assuming you want to keep this for form submission.
    }
  };

  const triggerFileInputClick = () => fileInputRef.current?.click();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user || details.trim() === "" || timestamp.trim() === "") {
      console.log("Missing user information or required fields are empty");
      return;
    }
    addWhoopsie({ user, level, timestamp, details, imageFile });
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
            key={level}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-4"
          >
            <div className="text-lg font-medium text-blue-600">
              {whoopsieLevels[level].name}
            </div>
            <motion.p
              className="text-sm text-gray-500"
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
            >
              {whoopsieLevels[level].description}
            </motion.p>
          </motion.div>
          <input
            type="range"
            min="0"
            max="9"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            // onChange={(e) => console.log(e.target.value)}
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
          <div className="flex items-center justify-between">
            <input
              type="datetime-local"
              id="timestamp"
              name="timestamp"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block  shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
            />
            <div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }} // Hide the file input.
                onChange={handleImageChange}
                accept="image/*" // Optional: Restrict to image files.
              />
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  triggerFileInputClick();
                }}
                className="px-4 py-2 bg-pink-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              >
                <Camera />
              </button>
            </div>
          </div>
        </div>
        <ImagePreview imageURL={imageURL} />
        <div>
          <div className="flex justify-between">
            <label
              htmlFor="details"
              className="block text-sm font-medium text-gray-500"
            >
              Details
            </label>
          </div>
          <textarea
            id="details"
            name="details"
            rows={4}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2 md:text-lg"
          />
        </div>
        <div className="flex justify-between">
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
