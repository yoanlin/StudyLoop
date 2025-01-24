import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
interface Params {
  rating: number;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calcAverageRating = (ratingArray: Params[]): number => {
  if (ratingArray.length === 0) return 0;

  const total = ratingArray.reduce(
    (acc, currentValue) => acc + currentValue.rating,
    0
  );
  const averageRating = total / ratingArray.length;

  return Math.round(averageRating * 10) / 10;
};

export const getTimeStamp = (createdAt: Date) => {
  const date = new Date(createdAt);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(secondsAgo / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.label}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};
