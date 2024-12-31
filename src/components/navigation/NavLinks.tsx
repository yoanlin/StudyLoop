"use client";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLinks = () => {
  const pathname = usePathname();
  return (
    <div className="mt-24 flex flex-col items-end">
      {sidebarLinks.map((item) => {
        const isSelected =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;
        return (
          <div
            key={item.route}
            className={`flex w-1/2 justify-start p-4 ${isSelected && "bg-secondary font-bold"}`}
          >
            <Link href={item.route} className="flex gap-3 text-base">
              <Image src={item.imgURL} alt={item.name} width={20} height={20} />
              <p className="text-xl max-lg:hidden">{item.name}</p>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default NavLinks;
