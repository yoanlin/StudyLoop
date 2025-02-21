import React from "react";
import { PostCardInfo } from "../../../types/global";
import Link from "next/link";
import ROUTES from "../../../constants/routes";
import { calcAverageRating, getTimeStamp } from "@/lib/utils";
import Image from "next/image";

interface Props {
  post: PostCardInfo;
}

const PostCard = ({ post }: Props) => {
  const { title, field, comments, content, author, createdAt } = post;
  const averageRating = calcAverageRating(comments);
  return (
    <div className="relative h-36 w-full rounded-lg border bg-background px-5 font-markaziText shadow">
      <Link className="mt-5 block size-full" href={ROUTES.POST(post.id)}>
        <span className="rounded-lg bg-secondary px-3">{field.name}</span>
        <p className="absolute right-10 top-0 w-10 rounded-b-md bg-[#f5a340] py-2 text-center text-3xl font-black sm:right-14">
          {averageRating > 0 ? averageRating : "0"}
        </p>
        <p className="absolute right-2 top-7 text-gray-400 sm:right-5">{`(${comments.length})`}</p>

        <h3 className="line-clamp-1 w-4/5 text-wrap text-2xl font-bold lg:text-3xl">
          {title}
        </h3>

        <p className="line-clamp-1">{content}</p>

        <PostDetails author={author} createdAt={createdAt} />
      </Link>
    </div>
  );
};

interface DetailsProps {
  author: {
    name: string;
    id: string;
    image: string | null;
  };
  createdAt: Date;
}

const PostDetails = ({ author, createdAt }: DetailsProps) => {
  return (
    <div className="mt-2 flex space-x-3">
      <div className="space-x-2">
        <Image
          src={author.image ? author.image : "/fb-Avatar.png"}
          alt="avatar"
          width={18}
          height={18}
          className="inline-block size-[18px] rounded-full object-cover"
        />
        <span>{author.name}</span>
      </div>
      <p className="text-muted">{getTimeStamp(createdAt)}</p>
    </div>
  );
};

export default PostCard;
