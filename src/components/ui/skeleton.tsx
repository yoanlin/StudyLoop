import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-stone-300/20 dark:bg-gray-700/40",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
