"use client";
import React, { useEffect } from "react";
import Hero from "./Hero";
import Searchbar from "./navigation/Searchbar";
import FilterSelector from "./FilterSelector";
import { PostCardInfo } from "../../types/global";
import PostCard from "./cards/PostCard";
import Pagination from "./Pagination";
import { useToastStore } from "@/store/toastStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface HomePageProps {
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  posts: PostCardInfo[] | undefined;
  isNext: boolean | undefined;
  query: string;
  page: string;
}

const HomePage = ({
  success,
  error,
  posts,
  isNext,
  query,
  page,
}: HomePageProps) => {
  const showToast = useToastStore((state) => state.showToast);
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("loggedIn") === "true") {
      showToast(`Welcome back ${session?.user?.name} 😊`, "success");
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("loggedIn");
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchParams, session, showToast, pathname, router]);

  return (
    <div className="scrollbar-hide flex h-screen w-full flex-col items-center overflow-x-hidden">
      <main className="flex size-full flex-col pb-16">
        <Hero />
        <section className="mt-10 flex flex-col items-center gap-5 px-10 pb-20 md:px-20 lg:max-w-3xl xl:max-w-5xl">
          <div className="flex w-full max-w-3xl flex-col items-center justify-between gap-5 sm:flex-row">
            <Searchbar
              route="/"
              placeholder="Search for learning resources"
              otherClass="w-full border h-12"
            />
            <FilterSelector
              options={[
                { value: "newest", label: "Newest" },
                { value: "oldest", label: "Oldest" },
                { value: "top_rated", label: "Top Rated" },
              ]}
            />
          </div>

          <p className="w-full font-bowlbyOneSC text-2xl xl:pl-24">
            {query ? `"${query}"` : "All Post"}
          </p>

          {success ? (
            <div className="w-full max-w-2xl space-y-2 sm:space-y-4">
              {posts && posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <div>
                  <p className="mt-10 w-full text-center font-markaziText text-2xl">
                    No posts found🥲
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p>{error?.message || "Failed to fetch posts"}</p>
            </div>
          )}

          <Pagination
            pageNumber={page ? +page : 1}
            isNext={isNext ? isNext : false}
          />
        </section>
      </main>
    </div>
  );
};

export default HomePage;
