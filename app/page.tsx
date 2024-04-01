"use client";
import AllWhoopsies from "@/components/AllWhoopsies";
import LandingPage from "@/components/LandingPage";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";

export default function Home() {
  const { user } = useKindeBrowserClient();
  return <>{!user ? <LandingPage /> : <AllWhoopsies />}</>;
}
