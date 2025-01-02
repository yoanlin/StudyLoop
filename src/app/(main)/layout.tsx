import LeftSidebar from "@/components/navigation/LeftSidebar";
import React, { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <LeftSidebar />
      <section className="ml-80 bg-background">{children}</section>
    </div>
  );
};

export default MainLayout;
