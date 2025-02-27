"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";

import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../ui/button";
import UserAvatar from "../UserAvatar";
import { useSession } from "next-auth/react";

const Navbar = ({ isMain }: { isMain?: boolean }) => {
  const { data: session, status } = useSession();
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    if (status === "authenticated") {
      setIsLogin(true);
    } else if (status === "unauthenticated") {
      setIsLogin(false);
    }
  }, [status]);

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
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {isLogin && session && session.user ? (
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
