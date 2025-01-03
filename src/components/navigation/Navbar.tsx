import React from "react";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";
import Searchbar from "./Searchbar";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 flex h-24 items-center justify-between border-b bg-primary px-6 max-sm:h-16">
      <div className="flex cursor-pointer gap-5">
        <MobileNav />
        <Link href="/home" className="flex gap-5">
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
      <Searchbar />
      <div className="flex items-center gap-3">
        <Search
          color="#c0c0c0"
          strokeWidth={2.5}
          className="ml-2 cursor-pointer lg:hidden"
        />
        <ThemeToggle />
        <Button className="button font-markaziText text-lg">Log in</Button>
      </div>
    </nav>
  );
};

export default Navbar;
