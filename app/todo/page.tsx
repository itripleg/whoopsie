"use client";
import { motion } from "framer-motion";
import React from "react";

// Define the button animation variants
const buttonVariants = {
  animate: {
    scale: [1, 1.05], // Pulse between normal size and slightly larger
    boxShadow: [
      "0px 0px 8px rgb(255, 255, 255)",
      "0px 0px 12px rgb(255, 255, 255)",
    ], // Pulse the shadow for a glowing effect
    transition: {
      duration: 0.8, // Duration of one cycle of the animation
      ease: "easeInOut", // Use an easing function for a more natural animation
      loop: Infinity, // Loop the animation indefinitely
    },
  },
};

// The Button component itself
const DoNotPressButton = () => {
  // Function to handle the button click
  const handleClick = () => {
    alert("Oops! You could not resist, could you?");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <motion.button
        variants={buttonVariants}
        animate="animate" // Apply the pulsing animation at all times
        className="bg-red-600 text-white font-bold py-4 px-8 rounded-full cursor-pointer"
        onClick={handleClick}
      >
        DO NOT PRESS
      </motion.button>
    </div>
  );
};

export default DoNotPressButton;
