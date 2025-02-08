import PostCard from "@/components/cards/PostCard";
import FilterSelector from "@/components/FilterSelector";
import Searchbar from "@/components/navigation/Searchbar";
import SubscribeButton from "@/components/SubscribeButton";
import { getPosts } from "@/lib/actions/post.action";
import React from "react";

const FieldPage = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, query, filter } = await searchParams;
  const { success, error, data } = await getPosts({
    query: query || "",
    filter: filter || "",
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    sort: id || "",
  });

  const { posts } = data || {};

  return (
    <section className="mt-10 w-full max-w-2xl px-10 sm:ml-20 lg:max-w-4xl">
      <div className="flex w-full flex-col justify-between gap-5 sm:flex-row">
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
      {success && posts ? (
        <section className="mt-10 max-w-4xl space-y-2 sm:space-y-4">
          <div className="flex gap-5">
            <h2 className="font-bowlbyOneSC text-2xl">
              {posts[0].field.name.toUpperCase()}
            </h2>
            <SubscribeButton fieldId={posts[0].fieldId} />
          </div>

          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div>
              <p>No posts found</p>
            </div>
          )}
        </section>
      ) : (
        <div>
          <p>{error?.message || "Failed to fetch posts"}</p>
        </div>
      )}
    </section>
  );
};

export default FieldPage;
