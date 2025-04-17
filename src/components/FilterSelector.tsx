"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/url";

const FilterSelector = ({
  options,
}: {
  options: { value: string; label: string }[];
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleUpdate = (value: string) => {
    let newUrl = "";

    newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value,
    });

    router.push(newUrl, { scroll: false });
  };
  return (
    <Select onValueChange={handleUpdate}>
      <SelectTrigger className="h-12 w-full font-markaziText text-xl sm:w-52">
        <SelectValue placeholder={options[0].label} />
      </SelectTrigger>
      <SelectContent className="font-markaziText ">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="py-4 text-xl"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterSelector;
