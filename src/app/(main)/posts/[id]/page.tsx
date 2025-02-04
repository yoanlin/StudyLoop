import Comment from "@/components/form/Comment";
import { getPost } from "@/lib/actions/post.action";
import { calcAverageRating, getTimeStamp } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ROUTES from "../../../../../constants/routes";

const PostDetails = async ({ params }: RouteParams) => {
  const { id } = await params;
  const { data, error, success } = await getPost({ postId: id });

  if (success && data) {
    const averageRating = calcAverageRating(
      data.comments.map((comment) => ({ rating: comment.rating }))
    );
    return (
      <div className="mt-10 max-w-5xl px-10 font-markaziText text-xl">
        <div className="space-y-3">
          <Link
            href={ROUTES.FIELD(data.fieldId)}
            className="inline-block rounded-lg bg-secondary px-3"
          >
            {data.field.name}{" "}
          </Link>
          <span className="ml-5">+ subscribe</span>
          <h2 className="font-bowlbyOneSC text-2xl">
            {data.title.toUpperCase()}{" "}
            <span className="font-markaziText">
              {data.comments.length > 0
                ? `(${averageRating})`
                : "(No comments yet)"}
            </span>
          </h2>

          <div>
            <Image
              src={data.author.image ? data.author.image : "/fb-Avatar.png"}
              alt="avatar"
              width={20}
              height={20}
              className="inline-block rounded-full"
            />
            <Link href={`/user/${data.author.id}`} className="ml-3">
              {data.author.name} - {getTimeStamp(data.createdAt)}
            </Link>
            <p className="mt-10 border-y px-10 py-5">{data.content}</p>
          </div>
        </div>

        <Comment />
      </div>
    );
  } else
    return (
      <>
        <p>{error?.message}</p>
      </>
    );
};

export default PostDetails;
