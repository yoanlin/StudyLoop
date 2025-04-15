import { Skeleton } from "@/components/ui/skeleton";

const SubsriptionLoading = () => {
  return (
    <div className="mx-8 mt-10 overflow-hidden sm:mx-32">
      <div className="flex max-w-2xl flex-col gap-3 sm:flex-row">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full sm:w-1/3" />
      </div>

      <div className=" mt-20 flex w-full max-w-2xl flex-col gap-5 overflow-hidden sm:grid sm:grid-cols-2 xl:grid-cols-3 ">
        {Array(12)
          .fill(null)
          .map((_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
      </div>
    </div>
  );
};

export default SubsriptionLoading;
