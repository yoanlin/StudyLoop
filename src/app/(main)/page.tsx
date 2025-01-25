import PostCard from "@/components/cards/PostCard";
import FilterSelector from "@/components/FilterSelector";
import Hero from "@/components/Hero";
import Searchbar from "@/components/navigation/Searchbar";
import { getPosts } from "@/lib/actions/post.action";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function Home({ searchParams }: SearchParams) {
  const { query, page, pageSize, filter } = await searchParams;

  const { success, data, error } = await getPosts({
    query: query || "",
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter: filter || "",
  });

  const { posts } = data || {};

  return (
    <div className="scrollbar-hide flex h-screen w-full flex-col items-center overflow-x-hidden">
      <main className="flex size-full flex-col pb-8">
        <Hero />
        <section className="mt-10 flex flex-col items-center gap-5 px-10 md:px-20 lg:max-w-3xl xl:max-w-5xl">
          <div className="flex w-full max-w-2xl flex-col items-center justify-between gap-5 sm:flex-row">
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
            <div className="max-w-2xl space-y-2 sm:space-y-4">
              {posts && posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <div>
                  <p>No posts found</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p>{error?.message || "Failed to fetch posts"}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
