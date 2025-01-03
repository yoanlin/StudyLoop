"use client";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SheetClose } from "../ui/sheet";
import React from "react";
import { cn } from "@/lib/utils";

const NavLinks = ({ isMobileNav = false }: { isMobileNav?: boolean }) => {
  const pathname = usePathname();
  return (
    <div className="mt-24 flex w-full flex-col items-center lg:items-end">
      {sidebarLinks.map((item) => {
        const isSelected =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;
        const LinkComponent = (
          <Link
            key={item.route}
            href={item.route}
            className={cn(
              "flex shrink justify-start p-4 sm:p-6 gap-3 w-full hover:bg-secondary lg:w-48 xl:w-56 lg:p-4",
              isSelected && "bg-secondary font-bold"
            )}
          >
            <Image
              src={item.imgURL}
              alt={item.name}
              width={20}
              height={20}
              className="dark:invert"
            />
            <p className={cn("text-2xl", !isMobileNav && "max-lg:hidden")}>
              {item.name}
            </p>
          </Link>
        );
        return isMobileNav ? (
          <SheetClose asChild key={item.route}>
            {LinkComponent}
          </SheetClose>
        ) : (
          <React.Fragment key={item.route}>{LinkComponent}</React.Fragment>
        );
      })}
    </div>
  );
};

export default NavLinks;
