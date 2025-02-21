import Searchbar from "@/components/navigation/Searchbar";
import { getSubscribedFields } from "@/lib/actions/field.action";
import React from "react";
import { SearchParams } from "../../../../types/global";
import FieldCard from "@/components/cards/FieldCard";
import Pagination from "@/components/Pagination";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const SubscriptionPage = async ({ searchParams }: SearchParams) => {
  const { query, page, pageSize } = await searchParams;
  const { success, data, error } = await getSubscribedFields({
    query: query || "",
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 2,
    userId: null,
  });
  const { fields, isNext } = data || {};
  const session = await auth();
  if (!session) redirect("/login");
  return (
    <div className="mt-10 w-full max-w-3xl px-10 text-2xl sm:ml-20 ">
      <Searchbar
        route="/subscriptions"
        placeholder="Search for field"
        otherClass="h-12"
      />

      <main className="mt-10 flex h-screen flex-col font-bowlbyOneSC">
        <h2 className="text-2xl">SUBSCRIPTIONS</h2>
        <section className="mb-10 mt-5 flex flex-wrap gap-5 xl:flex-nowrap">
          {success ? (
            fields && fields.length > 0 ? (
              fields.map((field) => (
                <FieldCard key={field.id} fieldInfo={field} />
              ))
            ) : (
              <p>No fields found</p>
            )
          ) : (
            <p>{error?.message ? error.message : "Failed to fetch fields"}</p>
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

export default SubscriptionPage;
