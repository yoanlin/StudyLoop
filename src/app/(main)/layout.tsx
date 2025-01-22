import LeftSidebar from "@/components/navigation/LeftSidebar";
import Navbar from "@/components/navigation/Navbar";
import React, { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar isMain />
      <LeftSidebar />
      <section className="bg-background max-lg:pl-16 max-sm:pl-0 lg:pl-[max(20rem,calc(100vw-60rem)/2)]">
        {children}
      </section>
    </div>
  );
};

export default MainLayout;
