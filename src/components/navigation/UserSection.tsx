"use client";
import { userbarLinks } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import { SheetClose } from "../ui/sheet";
import { cn } from "@/lib/utils";

const UserSection = ({ isMobileNav = false }: { isMobileNav?: boolean }) => {
  const pathname = usePathname();
  return (
    <div
      className={cn(
        "mt-5 flex flex-col",
        isMobileNav ? "items-start" : "items-end"
      )}
    >
      <h3 className="cursor-default self-center text-xl">Personal</h3>
      {userbarLinks.map((item) => {
        const isSelected =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;
        const LinkComponent = (
          <Link
            key={item.route}
            href={item.route}
            className={`flex w-2/3 justify-start gap-3 p-4 hover:bg-secondary max-lg:w-auto max-lg:p-6 max-sm:w-full max-sm:p-4 ${isSelected && "bg-secondary font-bold"}`}
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

export default UserSection;
