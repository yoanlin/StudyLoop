import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const PostDetailloading = () => {
  return (
    <div className="max-w-5xl p-10">
      <main className="mt-5 w-full">
        <div className="flex w-64 gap-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-10 w-1/2" />
        </div>

        <Skeleton className="mt-5 h-10 w-4/5" />
        <div className="mt-5 flex gap-5">
          <Skeleton className="size-7 rounded-full" />
          <Skeleton className="h-7 w-40" />
        </div>

        <div>
          <Skeleton className="mt-5 h-10 w-4/5" />
          <Skeleton className="mt-5 h-10 w-4/5" />
          <Skeleton className="mt-5 h-10 w-4/5" />
          <Skeleton className="mt-5 h-10 w-1/5" />
        </div>
      </main>

      <section className="mt-10 flex w-full flex-col gap-y-5">
        {Array(3)
          .fill(null)
          .map((_, index) => (
            <Skeleton key={index} className="h-40 w-full" />
          ))}
      </section>
    </div>
  );
};

export default PostDetailloading;
