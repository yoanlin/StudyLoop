import React from "react";
import NavLinks from "./NavLinks";
import UserSection from "./UserSection";

const LeftSidebar = () => {
  return (
    <section className="fixed left-0 top-0 h-full w-80 bg-primary font-markaziText">
      <NavLinks />

      <UserSection />
    </section>
  );
};

export default LeftSidebar;
