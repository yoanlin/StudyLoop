import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import NavLinks from "./NavLinks";
import UserSection from "./UserSection";

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu strokeWidth={2.75} color="#c0c0c0" className="sm:hidden" />
      </SheetTrigger>
      <SheetContent side={"left"} className="max-w-80 bg-primary">
        <SheetTitle className="hidden">Navigation</SheetTitle>
        <Link href="/" className="flex items-center gap-5 bg-primary">
          <Image src="/boat.png" alt="Logo" width={50} height={50} />
          <h1 className="font-bowlbyOneSC text-3xl">Study Loop</h1>
        </Link>
        <div className="flex h-full overflow-y-auto font-markaziText">
          <SheetClose asChild>
            <section className="flex h-full flex-col gap-6">
              <NavLinks isMobileNav />
              <UserSection isMobileNav />
            </section>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
