import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ProfileLoading = () => {
  return (
    <div className="mx-8 lg:mx-12 lg:flex">
      <section className="mt-12 flex w-full items-center justify-around gap-3 lg:w-1/3 lg:flex-col lg:items-center lg:justify-start">
        <Skeleton className="size-32 rounded-full lg:size-48" />
        <Skeleton className="h-20 w-1/3 lg:w-1/2" />
        <Skeleton className="h-20 w-1/3 lg:h-10 lg:w-1/2 " />
      </section>

      <section className="mt-10 lg:w-1/2">
        <Skeleton className="h-10 w-full" />

        <div className="mt-6 flex flex-col gap-3 lg:mt-10">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <Skeleton key={index} className="h-32 w-full" />
            ))}
        </div>
      </section>
    </div>
  );
};

export default ProfileLoading;
