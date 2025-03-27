import { getPosts } from "@/lib/actions/post.action";
import { SearchParams } from "../../../types/global";
import HomePage from "@/components/HomePage";

export default async function Home({ searchParams }: SearchParams) {
  const { query, page, pageSize, filter } = await searchParams;

  const { success, data, error } = await getPosts({
    query: query || "",
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter: filter || "",
  });

  const { posts, isNext } = data || {};

  return (
    <>
      <HomePage
        success={success}
        error={error}
        posts={posts}
        isNext={isNext}
        query={query}
        page={page}
      />
    </>
  );
}
