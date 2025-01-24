import PostCard from "@/components/cards/PostCard";
import FilterSelector from "@/components/FilterSelector";
import Hero from "@/components/Hero";
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
  return (
    <div className="flex h-screen w-full flex-col items-center overflow-x-hidden">
      <main className="flex size-full flex-col pb-8">
        <Hero />
        <section className="mt-10 flex flex-col items-center gap-5 px-10 md:px-20 lg:max-w-3xl xl:max-w-5xl">
          <div className="flex w-full max-w-2xl flex-col items-center justify-between gap-5 sm:flex-row">
            <h1 className="self-start font-bowlbyOneSC text-3xl">All Posts</h1>
            <FilterSelector
              options={[
                { value: "newest", label: "Newest" },
                { value: "top_rated", label: "Top Rated" },
              ]}
            />
          </div>

          {success ? data?.posts[0].title : error?.message}
        </section>
      </main>
    </div>
  );
}
