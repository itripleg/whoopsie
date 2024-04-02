import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/firebaseConfig";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

type Comment = {
  id: string;
  timestamp: string;
  comment: string;
  firstName: string;
  lastName: string;
};

interface WhoopsieProps {
  id: string;
  level: string;
  timestamp: string;
  details: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  deleteWhoopsie?: () => void;
  comments?: Comment[];
}

const formatDateTimeLocal = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
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
  const { user } = useKindeBrowserClient();
  const pathname = usePathname();
  const [toggle, setToggle] = useState(false);
  const formattedDateTime = formatDateTimeLocal(timestamp);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    // Fetch likes count
    const likesRef = collection(db, `whoopsies/${id}/likes`);
    const unsubscribeLikes = onSnapshot(likesRef, (snapshot) => {
      setLikes(snapshot.size);
      const userId = user?.id; // Assuming `user` object has a `uid` property
      const hasLiked = snapshot.docs.some((doc) => doc.id === userId);
      setHasLiked(hasLiked);
    });

    return () => {
      unsubscribeLikes();
    };
  }, [id, user?.id]);

  const handleLike = async () => {
    const userId = user?.id;
    if (!userId) return;

    const likeRef = doc(db, `whoopsies/${id}/likes`, userId);
    if (hasLiked) {
      // Unlike
      await deleteDoc(likeRef);
    } else {
      // Like
      await setDoc(likeRef, { timestamp: serverTimestamp() });
    }
  };

  useEffect(() => {
    const commentsRef = query(
      collection(db, `whoopsies/${id}/comments`),
      orderBy("timestamp", "desc")
    );
    console.log("use effect");
    const unsubscribe = onSnapshot(
      commentsRef,
      (querySnapshot) => {
        const commentsData: Comment[] = querySnapshot.docs.map((doc) => {
          console.log(doc.data);
          return {
            id: doc.id,
            ...doc.data(),
          } as Comment;
        });

        setComments(commentsData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching comments:", error);
      }
    );

    return () => unsubscribe();
  }, [id]);
  // Handle new comment submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const commentsRef = collection(db, `whoopsies/${id}/comments`);
      await addDoc(commentsRef, {
        comment: newComment,
        timestamp: serverTimestamp(),
        firstName: user?.given_name,
        lastName: user?.family_name,
      });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  return (
    <div className="flex space-y-4 justify-center items-center relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-700 text-white p-4 rounded-lg mb-4 shadow-lg flex-col space-y-4 max-w-4xl w-full"
      >
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <Card className="bg-white w-full">
                <CardHeader>
                  <CardTitle>
                    <h1 className="text-lg">{level}</h1>
                    {firstName} {lastName}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {formattedDateTime}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* <p>See Details</p> */}
                  <p>{details}</p>
                </CardContent>
                {/* <CardFooter>
                <p>Card Footer</p>
              </CardFooter> */}
              </Card>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex pb-2">
                {/* <p>😂😅🤭🙄 13 Likes</p> */}
                <button onClick={handleLike}>
                  {hasLiked ? "❤️" : "🤍"} {likes} Likes
                </button>
                {/* <div className="text-sm mb-2">{formattedDateTime}</div> */}
                {pathname == "/dashboard" && (
                  <div>
                    <button
                      onClick={deleteWhoopsie}
                      className="delete-btn text-red-600 absolute top-0 right-2 p-1"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="max-h-[200px] flex-col overflow-y-auto p-1">
                {comments?.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }} // Start with the element 20px down from its final position and invisible
                    animate={{ opacity: 1, y: 0 }} // Animate to fully visible and in its final position
                    transition={{ duration: 0.5 }} // Control the speed of the animation
                    className="py-2 border p-1 rounded-md my-1"
                  >
                    <div className="">
                      {/* <p>{formatDate(comment.timestamp)}</p> */}
                      <h1 className="text-xs">
                        {comment.firstName} {comment.lastName}
                      </h1>
                    </div>
                    <p>{comment.comment}</p>{" "}
                    {/* Make sure to use the correct property name */}
                  </motion.div>
                ))}
              </div>
              <div>
                {" "}
                <form onSubmit={handleSubmit} className="flex justify-between">
                  <input
                    type="text"
                    placeholder="Comment..."
                    className="p-1 rounded-md text-black w-full max-w-lg lg:max-w-3xl mx-1"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button type="submit" className="border p-2 px-4 rounded-md">
                    Submit
                  </button>
                </form>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>
    </div>
  );
};

export default Whoopsie;
