import FieldCard from "@/components/cards/FieldCard";
import FilterSelector from "@/components/FilterSelector";
import Searchbar from "@/components/navigation/Searchbar";
import { getFields } from "@/lib/actions/field.action";
import React from "react";
import { SearchParams } from "../../../../types/global";
import Image from "next/image";
import Banner from "@/components/Banner";

const FieldsPage = async ({ searchParams }: SearchParams) => {
  const { query, filter, page, pageSize } = await searchParams;
  const { data, error, success } = await getFields({
    query: query || "",
    filter: filter || "",
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 30,
  });

  const { fields } = data || {};

  return (
    <div className="mt-10 w-full max-w-2xl px-10 text-2xl sm:ml-20 lg:max-w-4xl">
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

      <main className="mt-10 h-screen font-bowlbyOneSC">
        <h2 className="text-2xl">ALL FIELDS</h2>
        <section className="mt-5 flex flex-wrap gap-5 xl:flex-nowrap">
          {success ? (
            fields && fields.length > 0 ? (
              fields.map((field) => (
                <FieldCard key={field.id} fieldInfo={field} />
              ))
            ) : (
              <p>No fields found</p>
            )
          ) : (
            <p>Failed to fetch fields</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default FieldsPage;
