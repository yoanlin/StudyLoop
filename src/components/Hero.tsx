"use client";

import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

const Hero = () => {
  const { resolvedTheme } = useTheme();
  const [theme, setTheme] = useState<string | undefined>("light");

  useEffect(() => {
    setTheme(resolvedTheme);
  }, [resolvedTheme]);

  return (
    <Suspense fallback={<Loading />}>
      <section className="flex w-full flex-col items-center gap-3 rounded-br-lg bg-[#fffce8] px-3 pt-10 dark:bg-[#282540] sm:flex-row sm:justify-between lg:max-w-3xl lg:pt-0 xl:max-w-5xl">
        <div className="flex flex-col justify-evenly gap-3 sm:size-full sm:pl-8 lg:w-1/2 xl:justify-around">
          <p className="text-lg font-black sm:text-2xl lg:text-2xl xl:text-4xl">
            Found some valuable learning resources?
          </p>
          <Button
            className="button w-full font-markaziText text-lg text-black sm:w-52 xl:px-10 xl:text-xl"
            asChild
          >
            <Link href="/posts/upload">Share with the community</Link>
          </Button>
        </div>
        <Image
          src={theme === "light" ? "/treasure.png" : "/treasure-dark.png"}
          alt="hero image"
          width={600}
          height={600}
          className="h-auto w-[450px] shrink object-contain lg:w-[500px] xl:w-[600px]"
        />
      </section>
    </Suspense>
  );
};

const Loading = () => {
  return (
    <section className="w-full animate-pulse rounded-br-lg bg-[#fffce8] dark:bg-[#282540] lg:max-w-3xl lg:pt-0 xl:max-w-5xl"></section>
  );
};

export default Hero;
