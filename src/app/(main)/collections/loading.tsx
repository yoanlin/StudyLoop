import { Skeleton } from "@/components/ui/skeleton";

const CollectionLoading = () => {
  return (
    <div>
      <div className="mx-8 mt-14 flex flex-col gap-3 sm:mx-14 sm:flex-row lg:mx-40 lg:max-w-2xl">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full sm:w-1/3" />
      </div>

      <div className="mx-8 mt-20 flex flex-col gap-5 sm:mx-14 lg:mx-40 lg:max-w-2xl">
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <Skeleton key={index} className="h-36 w-full" />
          ))}
      </div>
    </div>
  );
};

export default CollectionLoading;
