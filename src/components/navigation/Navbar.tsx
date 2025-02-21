"use client";
import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";
import Searchbar from "./Searchbar";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../ui/button";
import UserAvatar from "../UserAvatar";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const Navbar = ({ isMain }: { isMain?: boolean }) => {
  const { data: session, status } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      )
        setIsExpanded(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <nav className="sticky top-0 z-50 flex h-24 items-center justify-between border-b bg-primary px-6 max-sm:h-16">
      <div className="flex cursor-pointer gap-5">
        <MobileNav />
        <Link href="/" className="flex gap-5">
          <Image
            src="/boat.png"
            alt="logo"
            width={50}
            height={50}
            className="size-auto -translate-y-1"
          />
          <h1 className="font-bowlbyOneSC text-3xl max-sm:hidden">
            Study Loop
          </h1>
        </Link>
      </div>
      {isMain && (
        <>
          <Searchbar
            route={"/"}
            placeholder="Search..."
            otherClass="max-lg:hidden lg:w-1/3"
          />
          <div className="flex items-center gap-3">
            <div ref={searchRef}>
              <Search
                color="#c0c0c0"
                strokeWidth={2.5}
                className={cn(
                  "ml-2 cursor-pointer lg:hidden",
                  isExpanded && "hidden"
                )}
                onClick={() => {
                  setIsExpanded(true);
                }}
              />
              <Searchbar
                route="/"
                placeholder="Search..."
                otherClass={`${isExpanded ? "w-full" : "hidden"}`}
              />
            </div>

            <ThemeToggle />

            {status === "authenticated" && session.user ? (
              <UserAvatar
                userId={session.user.id!}
                name={session.user.name!}
                imageUrl={session.user.image}
              />
            ) : (
              <Button className="button font-markaziText text-lg" asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
