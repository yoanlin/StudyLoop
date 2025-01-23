// "use client";
import React from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";
import Searchbar from "./Searchbar";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../ui/button";
import UserAvatar from "../UserAvatar";
import { auth } from "@/auth";

interface Session {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
  };
  expires: string;
}

const Navbar = async ({ isMain }: { isMain?: boolean }) => {
  // const [session, setSession] = useState<Session | null>(null);

  // useEffect(() => {
  //   async function fetchSession() {
  //     try {
  //       const response = await fetch("/api/fake-session");
  //       if (!response.ok) throw new Error("Failed to fetch session");
  //       const data = await response.json();
  //       setSession(data);
  //     } catch (error) {
  //       console.error("Error fetching mock session: ", error);
  //     }
  //   }
  //   fetchSession();
  // }, []);
  const session = await auth();
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
            className="-translate-y-1"
          />
          <h1 className="font-bowlbyOneSC text-3xl max-sm:hidden">
            Study Loop
          </h1>
        </Link>
      </div>
      {isMain && (
        <>
          <Searchbar route={"/"} placeholder="Search..." />
          <div className="flex items-center gap-3">
            <Search
              color="#c0c0c0"
              strokeWidth={2.5}
              className="ml-2 cursor-pointer lg:hidden"
            />
            <ThemeToggle />

            {session?.user!.id ? (
              <UserAvatar
                id={session.user.id}
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
