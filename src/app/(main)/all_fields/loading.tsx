import { Skeleton } from "@/components/ui/skeleton";

const AllFieldLoading = () => {
  return (
    <div className="mx-8 mt-14 overflow-hidden sm:mx-32">
      <div className="flex max-w-2xl flex-col gap-3 sm:flex-row">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full sm:w-1/3" />
      </div>

      <div className="mt-20 flex w-full max-w-2xl flex-col gap-4 overflow-hidden lg:flex-row lg:flex-wrap lg:gap-x-7 lg:gap-y-4">
        {Array(12)
          .fill(null)
          .map((_, index) => (
            <Skeleton
              key={index}
              className="h-14 w-full lg:w-[calc(33%-1.5rem)]"
            />
          ))}
      </div>
    </div>
  );
};

export default AllFieldLoading;
