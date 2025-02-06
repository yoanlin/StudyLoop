import { getComments } from "@/lib/actions/comment.action";
import React from "react";
import CommentCard from "./cards/CommentCard";

const AllComments = async ({ postId }: { postId: string }) => {
  const { data, success, error } = await getComments({ postId });

  if (success && data) {
    return (
      <>
        <h3 className="mb-5 text-3xl font-bold">{data?.length} Comments</h3>
        {data?.map((comment) => (
          <CommentCard key={comment.id} info={comment} />
        ))}
      </>
    );
  } else
    return (
      <>
        <p>{error?.message}</p>
      </>
    );
};

export default AllComments;
