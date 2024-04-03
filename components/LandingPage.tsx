"use client";
import {
  LoginLink,
  RegisterLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { motion } from "framer-motion";
import AllWhoopsies from "./AllWhoopsies";

export default function Home() {
  const { user } = useKindeBrowserClient();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center p-4"
      >
        <h1 className="text-5xl font-bold  mb-4 text-white/80">Whoopsie</h1>
        <p className="text-lg text-gray-700 mb-8">Whoops, you did it again.</p>
        <motion.div
          initial={{ opacity: 0 }}
          transition={{ delay: 1 }}
          animate={{ opacity: 1 }}
        >
          <LoginLink>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Login
            </motion.button>
          </LoginLink>
          <RegisterLink>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Sign Up
            </motion.button>
          </RegisterLink>
        </motion.div>
      </motion.div>
    </div>
  );
}
