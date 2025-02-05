"use server";

import action from "../handlers/action";
import { CommentServerSchema, GetCommentSchema } from "../validations";
import db from "@/db/db";
import { NotFoundError } from "../errors";
import { Comment } from "@prisma/client";
import { revalidatePath } from "next/cache";
import ROUTES from "../../../constants/routes";

export async function getComments(formdata: GetCommentsParams) {
  const validationResult = await action({ formdata, schema: GetCommentSchema });

  if (validationResult instanceof Error)
    return { success: false, error: { message: validationResult.message } };

  const { postId } = validationResult.formdata;

  try {
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}
export async function createComment(
  formdata: CreateCommentParams
): Promise<ActionResponse<Comment>> {
  const validationResult = await action({
    formdata,
    schema: CommentServerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return { success: false, error: { message: validationResult.message } };

  const { postId, content, rating } = validationResult.formdata!;
  const userId = validationResult.session?.user?.id;
  if (!userId) throw new NotFoundError("User");

  try {
    const newComment = await db.$transaction(async (tx) => {
      const post = await tx.post.findUnique({
        where: { id: postId },
      });
      if (!post) throw new Error("Post not found");

      return await tx.comment.create({
        data: {
          postId,
          createdById: userId,
          content,
          rating,
        },
      });
    });

    revalidatePath(ROUTES.POST(postId));

    return { success: true, data: JSON.parse(JSON.stringify(newComment)) };
  } catch (error) {
    console.log("Error creating comment: ", error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}
