"use client";

import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";

const Hero = () => {
  const { resolvedTheme } = useTheme();
  if (!resolvedTheme) {
    return <p>Loading...</p>;
  }
  return (
    <section className="flex w-full flex-col items-center gap-3 rounded-br-lg bg-[#fffce8] px-3 pt-10 dark:bg-[#282540] sm:max-w-5xl sm:flex-row sm:justify-between">
      <div className="flex flex-col justify-around gap-3 sm:size-full sm:pl-8 xl:justify-around">
        <p className="text-lg font-black sm:text-2xl lg:text-3xl xl:text-4xl">
          Found some valuable learning resources?
        </p>
        <Button className="button w-full font-markaziText text-lg text-black sm:w-52 xl:px-10 xl:text-xl">
          Share with the community
        </Button>
      </div>

      {resolvedTheme === "light" ? (
        <Image
          src="/treasure.png"
          alt="hero image"
          width={450}
          height={450}
          className="w-[450px] shrink object-contain lg:w-[450px]"
        />
      ) : (
        <Image
          src="/treasure-dark.png"
          alt="hero image"
          width={450}
          height={450}
          className="w-[450px] shrink object-contain lg:w-[450px]"
        />
      )}
    </section>
  );
};

export default Hero;
