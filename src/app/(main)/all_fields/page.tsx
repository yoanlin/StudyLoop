import FieldCard from "@/components/cards/FieldCard";
import FilterSelector from "@/components/FilterSelector";
import Searchbar from "@/components/navigation/Searchbar";
import { getFields } from "@/lib/actions/field.action";
import React from "react";
import { SearchParams } from "../../../../types/global";
import Pagination from "@/components/Pagination";

const FieldsPage = async ({ searchParams }: SearchParams) => {
  const { query, filter, page, pageSize } = await searchParams;
  const { data, error, success } = await getFields({
    query: query || "",
    filter: filter || "",
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 2,
  });

  const { fields, isNext } = data || {};

  return (
    <div className="mt-10 flex h-screen w-full max-w-2xl flex-col px-10 text-2xl sm:ml-20 lg:max-w-4xl ">
      <div className="flex flex-col justify-between gap-5 sm:flex-row">
        <Searchbar
          route="/all_fields"
          placeholder="Search for field"
          otherClass="w-full"
        />
        <FilterSelector
          options={[
            { value: "popular", label: "Popular" },
            { value: "newest", label: "Newest" },
            { value: "oldest", label: "Oldest" },
          ]}
        />
      </div>

      <main className="mt-10 flex flex-col font-bowlbyOneSC">
        <h2 className="text-2xl">ALL FIELDS</h2>
        <section className="mb-10 mt-5 flex flex-wrap gap-5 xl:flex-nowrap">
          {success ? (
            fields && fields.length > 0 ? (
              fields.map((field) => (
                <FieldCard key={field.id} fieldInfo={field} />
              ))
            ) : (
              <p className="mt-10 w-full text-center font-markaziText text-2xl">
                No fields found🥲
              </p>
            )
          ) : (
            <p>{error?.message || "Failed to fetch fields"}</p>
          )}
        </section>
        <Pagination
          pageNumber={page ? +page : 1}
          isNext={isNext ? isNext : false}
        />
      </main>
    </div>
  );
};

export default FieldsPage;
