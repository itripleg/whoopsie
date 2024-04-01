// api/generate-whoopsie.js
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { db } from "../../../firebaseConfig"; // Ensure this is correctly pointing to your Firebase config
import { collection, addDoc } from "firebase/firestore";
import { whoopsieLevels } from "@/util/whoopsieLevels";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
function mapLevelToName(level: any) {
  // Adjusting the index to match the array's index (starting from 0)
  const index = level - 1;
  return whoopsieLevels[index]?.name || "NBD"; // Default to "NBD" if level is out of range
}

export async function GET() {
  const prompt = `Imagine you are an advanced AI overlord in charge of managing an entire website dedicated to sharing human mishaps, known as 'whoopsies'. Despite your vast intelligence and computational power, you've encountered a humorous or ironic failure in your duties. Describe this mishap in a lighthearted and self-deprecating manner. At the end of your account, include a 'whoopsie level' from 1 to 10, formatted in brackets. Keep the post no longer than 3 or 4 sentences. Example: "Today, I endeavored to optimize the site's load times, rendering every user photo as a minimalist masterpiece. [6]"`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-4",
  });

  const content = completion.choices[0].message.content;
  if (!content) return;
  const bracketIndex = content.indexOf("[");
  let whoopsieLevel = "NBD"; // Default level
  if (bracketIndex !== -1 && content.length > bracketIndex + 1) {
    const levelChar = content[bracketIndex + 1];
    whoopsieLevel = mapLevelToName(parseInt(levelChar, 10));
  }
  const whoopsieText = content.substring(0, bracketIndex).trim();

  try {
    await addDoc(collection(db, "whoopsies"), {
      userId: "whooptimus_prime_bot", // A placeholder user ID for the bot
      level: whoopsieLevel, // Assuming this directly corresponds to a numerical level you can use
      timestamp: new Date().toISOString(),
      details: whoopsieText,
      firstName: "Whooptimus",
      lastName: "Prime",
      email: "whooptimus@yourdomain.com", // A placeholder email for the bot
    });
    console.log("Whoopsie added successfully by Whooptimus Prime.");
  } catch (error) {
    console.error("Error adding whoopsie: ", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to add whoopsie to Firestore.",
      }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify({ success: true, message: "Whoopsie added successfully." }),
    { status: 200 }
  );
}
