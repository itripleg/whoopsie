"use client";
import {
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import React from "react";

const NavigationHeader: React.FC = () => {
  const { user } = useKindeBrowserClient();
  return (
    <header className="bg-gray-800 text-white body-font shadow w-full">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link href="/">
          <span className="ml-3 text-xl">😅</span>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center gap-x-4">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          {user && (
            <>
              <LogoutLink>Logout</LogoutLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavigationHeader;
