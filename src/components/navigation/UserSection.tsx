"use client";
import { userbarLinks } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

const UserSection = () => {
  const pathname = usePathname();
  return (
    <div className="mt-10">
      <h3 className="translate-x-44 cursor-default text-2xl">Personal</h3>
      <div className="flex flex-col items-end ">
        {userbarLinks.map((item) => {
          const isSelected =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;
          return (
            <div
              key={item.route}
              className={`flex w-1/2 justify-start p-4 ${isSelected && "bg-secondary font-bold"}`}
            >
              <Link href={item.route} className="flex gap-3 text-base">
                <Image
                  src={item.imgURL}
                  alt={item.name}
                  width={20}
                  height={20}
                />
                <p className="text-xl max-lg:hidden">{item.name}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserSection;
