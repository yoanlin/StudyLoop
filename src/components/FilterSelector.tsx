import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FilterSelector = ({
  options,
}: {
  options: { value: string; label: string }[];
}) => {
  return (
    <Select>
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
