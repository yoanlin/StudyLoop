import LeftSidebar from "@/components/navigation/LeftSidebar";
import React, { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <LeftSidebar />
      <section className="bg-background max-lg:ml-16 max-sm:ml-0">
        {children}
      </section>
    </div>
  );
};

export default MainLayout;
