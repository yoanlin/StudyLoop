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
    <div className={cn("mt-24 flex flex-col items-end")}>
      {sidebarLinks.map((item) => {
        const isSelected =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;
        const LinkComponent = (
          <Link
            key={item.route}
            href={item.route}
            className={cn(
              "flex w-2/3 justify-start gap-3 p-4 max-lg:w-auto max-lg:p-6 max-sm:w-full max-sm:p-4 hover:bg-secondary",
              isSelected && "bg-secondary font-bold"
            )}
          >
            <Image src={item.imgURL} alt={item.name} width={20} height={20} />
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
