import Searchbar from "@/components/navigation/Searchbar";
import { getCollectedPosts } from "@/lib/actions/post.action";
import React from "react";
import { SearchParams } from "../../../../types/global";
import FilterSelector from "@/components/FilterSelector";
import PostCard from "@/components/cards/PostCard";

const CollectionPage = async ({ searchParams }: SearchParams) => {
  const { query, page, pageSize, filter } = await searchParams;
  const { success, data, error } = await getCollectedPosts({
    query: query || "",
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter: filter || "",
  });
  const { posts } = data || {};
  return (
    <div className="mt-10 w-full max-w-2xl px-10 sm:ml-20 lg:max-w-4xl">
      <div className="flex w-full max-w-2xl flex-col items-center justify-between gap-5 sm:flex-row">
        <Searchbar
          route="/collections"
          placeholder="Search for collected posts"
          otherClass="h-12 w-full"
        />
        <FilterSelector
          options={[
            { value: "newest", label: "Newest" },
            { value: "oldest", label: "Oldest" },
            { value: "top_rated", label: "Top Rated" },
          ]}
        />
      </div>

      <main className="mt-10 h-screen">
        {success ? (
          <div className="mt-5 max-w-2xl space-y-2 sm:space-y-4">
            <h2 className="font-bowlbyOneSC text-2xl">YOUR COLLECTIONS</h2>
            {posts && posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <p>No post found</p>
            )}
          </div>
        ) : (
          <h2 className="text-center font-bowlbyOneSC text-2xl">
            {error?.message || "Failed to fetch collections"}
          </h2>
        )}
      </main>
    </div>
  );
};

export default CollectionPage;
