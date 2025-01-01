import React from "react";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";
import Searchbar from "./Searchbar";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 flex h-24 items-center justify-between border-b bg-primary px-6 dark:text-white">
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
      <div className="mr-5 flex gap-8">
        <Search
          color="#c0c0c0"
          strokeWidth={2.5}
          className="ml-2 cursor-pointer lg:hidden"
        />
        <p>Light/Dark</p> <p>UserAvatar</p>
      </div>
    </nav>
  );
};

export default Navbar;
