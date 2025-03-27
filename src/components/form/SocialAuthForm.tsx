"use client";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useToastStore } from "@/store/toastStore";

const SocialAuthForm = () => {
  const showToast = useToastStore((state) => state.showToast);

  const handleSignIn = async (provider: "github" | "google") => {
    try {
      await signIn(provider, { redirectTo: "/?loggedIn=true" });
    } catch (error) {
      console.log(error);
      showToast("Failed to log in", "error");
    }
  };

  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row">
      <Button
        onClick={() => handleSignIn("google")}
        className="flex border bg-background py-5 text-foreground sm:w-1/2"
      >
        <Image
          src="/google.png"
          alt="google-icon"
          width={20}
          height={20}
          className="dark:invert"
        />
        <p>Log in with Google</p>
      </Button>
      <Button
        onClick={() => handleSignIn("github")}
        className="flex border bg-background py-5 text-foreground sm:w-1/2"
      >
        <Image
          src="/github.png"
          alt="google-icon"
          width={22}
          height={22}
          className="dark:invert"
        />
        <p>Log in with Github</p>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
