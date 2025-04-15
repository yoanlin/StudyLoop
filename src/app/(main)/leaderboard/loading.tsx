import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const LeaderBoardloading = () => {
  return (
    <div className="mx-8 mt-10 overflow-hidden lg:mx-32">
      <Skeleton className="h-12 w-full max-w-3xl" />

      <div className="mt-28 flex w-full max-w-3xl flex-wrap gap-5 overflow-hidden">
        {Array(8)
          .fill(null)
          .map((_, index) => (
            <Skeleton
              key={index}
              className="h-40 w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)]"
            />
          ))}
      </div>
    </div>
  );
};

export default LeaderBoardloading;
