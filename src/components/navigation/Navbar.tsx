import React from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="sticky top-0 flex h-24 items-center justify-between bg-primary px-6 dark:text-white">
      <Link href="/home" className="flex gap-5">
        <Image
          src="/boat.png"
          alt="logo"
          width={50}
          height={50}
          className="-translate-y-1"
        />
        <h1 className="text-pretty font-bowlbyOneSC text-3xl max-sm:hidden">
          Study Loop
        </h1>
      </Link>

      <Searchbar />
      <div className="mr-5 flex gap-8">
        <p>Light/Dark</p> <p>UserAvatar</p>
      </div>
    </nav>
  );
};

const Searchbar = () => {
  return (
    <div
      className="flex w-1/4 items-center rounded-lg bg-white focus:border max-lg:hidden
    "
    >
      <Search
        color="#c0c0c0"
        strokeWidth={2.5}
        className="ml-2 cursor-pointer"
      />
      <Input
        placeholder="Searching for learning resource."
        className="border-none focus:border-white focus-visible:ring-transparent"
      />
    </div>
  );
};

export default Navbar;
