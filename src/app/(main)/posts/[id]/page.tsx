import Comment from "@/components/form/Comment";
import { getPost } from "@/lib/actions/post.action";
import { calcAverageRating, getTimeStamp } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ROUTES from "../../../../../constants/routes";
import AllComments from "@/components/AllComments";
import SubscribeButton from "@/components/buttons/SubscribeButton";
import CollectButton from "@/components/buttons/CollectButton";
import EditButton from "@/components/buttons/EditDeleteButton";

const PostDetails = async ({ params }: RouteParams) => {
  const { id } = await params;
  const { data, error, success } = await getPost({ postId: id });

  if (success && data) {
    const averageRating = calcAverageRating(
      data.comments.map((comment) => ({ rating: comment.rating }))
    );
    return (
      <div className="max-w-5xl p-10 font-markaziText text-xl">
        <div className="space-y-5">
          <Link
            href={ROUTES.FIELD(data.fieldId)}
            className="mr-5 inline-block rounded-lg bg-secondary px-3 py-1"
          >
            {data.field.name}{" "}
          </Link>
          <SubscribeButton fieldId={data.fieldId} otherClass="inline-block" />
          <h2 className="flex gap-3 font-bowlbyOneSC text-2xl">
            {data.title.toUpperCase()}{" "}
            <span className="font-markaziText">
              {data.comments.length > 0
                ? `(${averageRating})`
                : "(No comments yet)"}
            </span>
            <EditButton postId={id} isAuthor={false} />
          </h2>

          <Link href={`/user/${data.author.id}`}>
            <Image
              src={data.author.image ? data.author.image : "/fb-Avatar.png"}
              alt="avatar"
              width={20}
              height={20}
              className="inline-block size-5 rounded-full object-cover"
            />
            <p className="ml-3 inline-block">
              {data.author.name} - {getTimeStamp(data.createdAt)}
            </p>
          </Link>
          <p className="relative px-10 py-5">{data.content}</p>

          <CollectButton postId={id} />
        </div>

        <div className="relative mt-20 rounded-lg border px-10 py-6 text-2xl shadow">
          <Comment postId={id} />
        </div>

        <section className="mt-10">
          <AllComments postId={id} />
        </section>
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
