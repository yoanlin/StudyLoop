"use client";
import { userbarLinks } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import { SheetClose } from "../ui/sheet";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const UserSection = ({ isMobileNav = false }: { isMobileNav?: boolean }) => {
  const pathname = usePathname();
  const { data } = useSession();
  if (!data) return;
  return (
    <div
      className={cn(
        "flex flex-col",
        isMobileNav ? "items-start" : "items-end",
        !data?.user && "hidden"
      )}
    >
      <h3 className="cursor-default self-center text-xl xl:self-end xl:pr-36">
        Personal
      </h3>
      {userbarLinks.map((item) => {
        const route =
          typeof item.route === "function"
            ? item.route(data.user!.id!)
            : item.route;
        const isSelected =
          (pathname.includes(route) && route.length > 1) ||
          pathname === item.route;

        const LinkComponent = (
          <Link
            key={item.name}
            href={route}
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
          <SheetClose asChild key={item.name}>
            {LinkComponent}
          </SheetClose>
        ) : (
          <React.Fragment key={item.name}>{LinkComponent}</React.Fragment>
        );
      })}
    </div>
  );
};

export default UserSection;
