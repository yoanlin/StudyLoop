"use client";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";

interface Props {
  route: string;
  placeholder: string;
  otherClass?: string;
}

const Searchbar = ({ route, placeholder, otherClass }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: searchQuery,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["query"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, router, searchParams, route, pathname]);
  return (
    <div
      className={`flex items-center rounded-lg bg-white focus:border ${otherClass}`}
    >
      <Search
        color="#c0c0c0"
        strokeWidth={2.5}
        className="ml-2 cursor-pointer"
      />
      <Input
        placeholder={`${placeholder}`}
        className="border-none shadow-none focus-visible:ring-transparent"
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        value={searchQuery}
      />
    </div>
  );
};

export default Searchbar;
