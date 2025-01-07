import SocialAuthForm from "@/components/form/SocialAuthForm";
import Navbar from "@/components/navigation/Navbar";
import Image from "next/image";
import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen w-full bg-white/90 bg-[url('/bg-boat.png')] bg-[size:150px_150px] bg-repeat-space bg-blend-overlay dark:bg-black/5">
      <Navbar />
      <main className="mt-14 flex items-center justify-center bg-repeat sm:mt-24">
        <div className="w-full flex-col rounded-lg border bg-background p-8 sm:max-w-[520px]">
          <h1 className="flex items-center justify-between text-3xl font-bold">
            Join Study Loop
            <Image src="/boat.png" alt="logo" width={65} height={30} />
          </h1>
          <p className="mt-2">
            sharing and obtaining all the valuable learning resources.
          </p>
          {children}

          <div className="mt-10">
            <SocialAuthForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
