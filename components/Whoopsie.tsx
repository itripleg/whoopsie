import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
interface WhoopsieProps {
  id: string;
  level: string;
  timestamp: string;
  details: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string; // Optional photo URL
  deleteWhoopsie?: () => void;
}

const formatDateTimeLocal = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true, // Use AM/PM format
  }).format(date);
};

const Whoopsie: React.FC<WhoopsieProps> = ({
  id,
  level,
  timestamp,
  details,
  firstName,
  lastName,
  photoUrl,
  deleteWhoopsie,
}) => {
  const formattedDateTime = formatDateTimeLocal(timestamp);
  const [toggle, setToggle] = useState(false);
  const pathname = usePathname();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-700 text-white p-4 rounded-lg mb-4 shadow-lg flex-col space-y-4"
    >
      {photoUrl && (
        <Image
          width={100}
          height={100}
          src={photoUrl}
          alt="Optional content"
          className="rounded-md mb-3 max-h-60 w-full object-cover"
        />
      )}
      <div className="flex justify-between">
        <div className="text-sm mb-2">{formattedDateTime}</div>
        {pathname == "/dashboard" && (
          <div>
            <button
              onClick={deleteWhoopsie}
              className="delete-btn text-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <p className="font-bold">Level: {level}</p>
      <p className="mb-2"> {details}</p>

      <p className="mb-3">Posted by: {`${firstName} ${lastName}`}</p>

      <div className="flex justify-end">
        <div className="flex items-center space-x-4">
          <span
            className="cursor-pointer"
            role="img"
            aria-label="likes"
            onClick={() => setToggle(!toggle)}
          >
            {toggle ? <p>❤️</p> : <p>🖤</p>}
          </span>
          <span role="img" aria-label="comments">
            💬
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default Whoopsie;
