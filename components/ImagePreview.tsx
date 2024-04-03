import Image from "next/image";
import { motion } from "framer-motion";

export default function ImagePreview({
  imageURL,
}: {
  imageURL: string | null;
}) {
  if (!imageURL) return null;

  return (
    <motion.div className="flex flex-col items-center" animate={{ opacity: 1 }}>
      <Image width={300} height={100} alt="" src={imageURL} />
    </motion.div>
  );
}
