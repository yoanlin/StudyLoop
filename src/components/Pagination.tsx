"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formUrlQuery } from "@/lib/url";

interface Props {
  pageNumber: number;
  isNext: boolean;
}

const Pagination = ({ pageNumber, isNext }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (direction: string) => {
    const nextPageNumber =
      direction === "prev" ? pageNumber - 1 : pageNumber + 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex items-center gap-3 text-foreground">
      <Button
        disabled={pageNumber === 1}
        className="border bg-background text-foreground"
        onClick={() => handleNavigation("prev")}
      >
        <ChevronLeft />
      </Button>
      <p className="px-2 py-1 font-markaziText text-xl">{pageNumber}</p>
      <Button
        disabled={!isNext}
        className="border bg-background text-foreground"
        onClick={() => handleNavigation("next")}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default Pagination;
