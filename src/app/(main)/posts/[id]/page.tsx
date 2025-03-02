import Comment from "@/components/form/Comment";
import { getPost } from "@/lib/actions/post.action";
import { calcAverageRating, cn, getTimeStamp } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ROUTES from "../../../../../constants/routes";
import AllComments from "@/components/AllComments";
import SubscribeButton from "@/components/buttons/SubscribeButton";
import CollectButton from "@/components/buttons/CollectButton";
import EditDeleteButton from "@/components/buttons/EditDeleteButton";
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";
import { auth } from "@/auth";

const PostDetails = async ({ params }: RouteParams) => {
  const session = await auth();
  const { id } = await params;
  const { data, error, success } = await getPost({
    postId: id,
    userId: session?.user?.id,
  });

  if (success && data) {
    const averageRating = calcAverageRating(
      data.comments.map((comment) => ({ rating: comment.rating }))
    );

    const isAuthor = session?.user?.id === data.authorId;

    return (
      <div className="max-w-5xl p-10 font-markaziText text-xl">
        <div className="mb-28 space-y-5">
          <Link
            href={ROUTES.FIELD(data.fieldId)}
            className="mr-5 inline-block rounded-lg bg-secondary px-3 py-1"
          >
            {data.field.name}{" "}
          </Link>
          <SubscribeButton fieldId={data.fieldId} otherClass="inline-block" />

          <h2 className="flex gap-3 font-bowlbyOneSC text-2xl">
            <p>
              {data.title.toUpperCase()}{" "}
              <span className="font-markaziText">
                {data.comments.length > 0
                  ? `(${averageRating})`
                  : "(No comments yet)"}
              </span>
            </p>
            <EditDeleteButton
              postId={id}
              authorId={data.authorId}
              type={"post"}
            />
          </h2>

          <Link href={`/profile/${data.author.id}`}>
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

          <MarkdownRenderer content={data.content} />

          <CollectButton postId={id} />
        </div>

        <div
          className={cn(
            "rounded-lg border px-10 py-6 text-2xl shadow",
            data.hasCommented || (isAuthor && "hidden")
          )}
        >
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
