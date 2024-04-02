import { motion } from "framer-motion";

interface SemiCircleIndicatorProps {
  value: number; // Value ranges from 0 to 10
}

const SemiCircleIndicator: React.FC<SemiCircleIndicatorProps> = ({ value }) => {
  const normalizedValue = Math.min(10, Math.max(0, value));
  const progress = normalizedValue / 10;
  const circumference = 314; // Approximate circumference of the semi-circle
  const strokeDashoffset = circumference - progress * circumference;

  // Calculate color based on progress
  const calculateColor = (progress: number) => {
    const red = Math.floor(255 * progress);
    const green = 255 - red;
    return `rgb(${red},${green},0)`;
  };

  const color = calculateColor(progress);

  return (
    <svg width="75" height="50" viewBox="0 0 200 100">
      <path
        d="M10,100 a90,90 0 0,1 180,0"
        fill="none"
        stroke="#fff" // White background for the semi-circle
        strokeWidth="20"
      />
      <motion.path
        d="M10,100 a90,90 0 0,1 180,0"
        fill="none"
        stroke={color} // Initial color
        strokeWidth="20"
        strokeDasharray="314"
        initial={{
          strokeDashoffset: circumference,
          stroke: "rgb(0,255,0)", // Initial color (green)
        }}
        animate={{
          strokeDashoffset: strokeDashoffset,
          stroke: color, // Target color based on value
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      {/* Add text element for value display */}
      <text
        x="100" // Center of the SVG width
        y="85" // Slightly above the bottom of the SVG height
        textAnchor="middle" // Centers the text on the x coordinate
        fill={color} // Text color
        fontSize="60" // Adjust as needed
        fontFamily="Arial, sans-serif" // Adjust as needed
      >
        {value}
      </text>
    </svg>
  );
};

export default SemiCircleIndicator;
