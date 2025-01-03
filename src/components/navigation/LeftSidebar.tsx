import React from "react";
import NavLinks from "./NavLinks";
import UserSection from "./UserSection";

const LeftSidebar = () => {
  return (
    <section className="fixed left-0 top-0 h-full bg-background font-markaziText max-lg:w-auto max-sm:hidden lg:w-[max(20rem,calc(100vw-60rem)/2)]">
      <NavLinks />

      <UserSection />
    </section>
  );
};

export default LeftSidebar;
