import React from "react";
import NavLinks from "./NavLinks";
import UserSection from "./UserSection";
import Image from "next/image";

const LeftSidebar = () => {
  return (
    <section className="fixed left-0 top-0 flex h-full flex-col border-r bg-background font-markaziText max-lg:w-auto max-sm:hidden lg:w-[max(20rem,calc(100vw-60rem)/2)] lg:justify-between">
      <NavLinks />

      <UserSection />
      <Image
        src="/desk.png"
        alt="desk"
        width={300}
        height={300}
        className="self-end opacity-60 max-lg:hidden"
      />
    </section>
  );
};

export default LeftSidebar;
