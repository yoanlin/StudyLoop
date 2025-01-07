import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

const SocialAuthForm = () => {
  return (
    <div className="flex flex-col justify-between gap-3 p-3 sm:flex-row">
      <Button className="flex border bg-background py-5 text-foreground sm:w-1/2">
        <Image
          src="/google.png"
          alt="google-icon"
          width={20}
          height={20}
          className="dark:invert"
        />
        <p>Log in with Google</p>
      </Button>
      <Button className="flex border bg-background py-5 text-foreground sm:w-1/2">
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
