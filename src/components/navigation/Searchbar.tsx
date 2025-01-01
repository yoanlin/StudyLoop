import { Search } from "lucide-react";
import { Input } from "../ui/input";

const Searchbar = () => {
  return (
    <div
      className="flex w-1/3 items-center rounded-lg bg-white focus:border max-lg:hidden
      "
    >
      <Search
        color="#c0c0c0"
        strokeWidth={2.5}
        className="ml-2 cursor-pointer"
      />
      <Input
        placeholder="Searching for learning resource."
        className="border-none focus:border-white focus-visible:ring-transparent"
      />
    </div>
  );
};

export default Searchbar;
