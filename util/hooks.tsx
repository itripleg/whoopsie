import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";

async function fetchComments(whoopsieId: string) {
  const commentsRef = collection(db, "whoopsies", whoopsieId, "comments");
  const q = query(commentsRef, orderBy("timestamp", "desc")); // Assuming you want the newest comments first

  const querySnapshot = await getDocs(q);
  const comments = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return comments;
}

import { doc, addDoc, serverTimestamp } from "firebase/firestore";

async function postComment(
  whoopsieId: string,
  userId: string,
  userName: string,
  commentText: string
) {
  const commentsRef = collection(db, "whoopsies", whoopsieId, "comments");
  await addDoc(commentsRef, {
    userId,
    userName,
    commentText,
    timestamp: serverTimestamp(), // Use Firestore server timestamp
  });
}
