import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
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
  getDocs,
} from "firebase/firestore";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { WhoopsieIndicator } from "./WhoopsieIndicator";

type Comment = {
  id: string;
  timestamp: string;
  comment: string;
  firstName: string;
  lastName: string;
  likesCount: number;
  hasLiked: boolean;
};

type CommentWithLikes = Comment & {
  likesCount: number;
  hasLiked: boolean;
};

interface WhoopsieProps {
  id: string;
  level: string;
  timestamp: string;
  details: string;
  firstName?: string;
  lastName?: string;
  imageURL?: string;
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
  imageURL,
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
  const [showIndicator, setShowIndicator] = useState(false);

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
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(commentsRef, async (querySnapshot) => {
      const commentsData: Promise<CommentWithLikes>[] = querySnapshot.docs.map(
        async (doc) => {
          const commentId = doc.id;
          // Fetch likes for the comment
          const likesSnapshot = await getDocs(
            collection(db, `whoopsies/${id}/comments/${commentId}/likes`)
          );
          const userId = user?.id;
          const hasLiked = likesSnapshot.docs.some(
            (likeDoc: any) => likeDoc.id === userId
          );
          return {
            id: doc.id,
            hasLiked,
            likesCount: likesSnapshot.size,
            ...doc.data(),
          } as CommentWithLikes;
        }
      );

      const resolvedCommentsData = await Promise.all(commentsData);
      setComments(resolvedCommentsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [id, user?.id]);

  const handleCommentLike = async (commentId: string, hasLiked: boolean) => {
    const userId = user?.id;
    if (!userId) return;

    // Optimistically update the UI
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likesCount: hasLiked
              ? comment.likesCount - 1
              : comment.likesCount + 1,
            hasLiked: !hasLiked,
          };
        }
        return comment;
      })
    );

    // Then update the database
    const likeRef = doc(
      db,
      `whoopsies/${id}/comments/${commentId}/likes`,
      userId
    );
    if (hasLiked) {
      // If previously liked, unlike it
      await deleteDoc(likeRef);
    } else {
      // If not liked before, like it
      await setDoc(likeRef, { timestamp: serverTimestamp() });
    }
  };

  const handleSubmit = async (e: any) => {
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
        <div className="flex w-full justify-center">
          {showIndicator && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <WhoopsieIndicator whoopsieName={level} />
            </motion.div>
          )}
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-2">
            <AccordionTrigger onClick={() => setShowIndicator(!showIndicator)}>
              <Card
                className="bg-white w-full"
                onClick={() => {
                  setToggle(!toggle);
                }}
              >
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
                  <motion.div
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ delay: 1 }}
                    // className={`${!toggle && "hidden"}`}
                  >
                    {imageURL && (
                      <Image
                        width={5000}
                        height={5000}
                        src={imageURL || "/background.webp"}
                        // src="/background.webp"
                        alt=""
                        className={`w-full rounded-md mt-4 z-40`}
                        onClick={() => {
                          if (toggle) {
                            // alert();
                          }
                        }}
                      />
                    )}
                  </motion.div>
                </CardContent>
                {/* <CardFooter>
                  <p>Card Footer</p>
                </CardFooter> */}
              </Card>
            </AccordionTrigger>
            <div className="flex justify-between pb-2">
              <button onClick={handleLike}>
                {hasLiked ? "❤️" : "🤍"} {likes} Likes
              </button>
              {comments.length > 0 && (
                <p className="mr-2">
                  {comments.length} Comment{comments.length > 1 ? "s" : ""}
                </p>
              )}
            </div>
            <AccordionContent>
              <div className="flex pb-2 ">
                {/* <p>😂😅🤭🙄 13 Likes</p> */}
                {/* <div className="text-sm mb-2">{formattedDateTime}</div> */}
                {pathname == "/dashboard" && (
                  <div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (deleteWhoopsie) {
                          deleteWhoopsie();
                        }
                      }}
                      className="delete-btn text-red-600 absolute top-0 right-2 p-1"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="max-h-[200px] flex-col overflow-y-auto p-1 scrollbar">
                {comments?.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }} // Start with the element 20px down from its final position and invisible
                    animate={{ opacity: 1, y: 0 }} // Animate to fully visible and in its final position
                    transition={{ duration: 0.5 }} // Control the speed of the animation
                    className="py-2 border p-1 rounded-md my-1"
                  >
                    <div className="flex justify-between">
                      {/* <p>{formatDate(comment.timestamp)}</p> */}
                      <div className="mx-2">
                        <h1 className="text-xs">
                          {comment.firstName} {comment.lastName}
                        </h1>
                        <p>{comment.comment}</p>
                      </div>
                      <button
                        onClick={() =>
                          handleCommentLike(comment.id, comment.hasLiked)
                        }
                        className="mr-1"
                      >
                        {comment.hasLiked ? "❤️" : "🤍"} {comment.likesCount}{" "}
                        Likes
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                  }}
                  className="flex justify-between"
                >
                  <input
                    type="text"
                    placeholder="Comment..."
                    className="p-1 rounded-md text-black w-full  lg:max-w-3xl mx-1"
                    value={newComment}
                    onChange={(e) => {
                      setNewComment(e.target.value);
                    }}
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
