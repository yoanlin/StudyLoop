"use server";

import action from "../handlers/action";
import {
  CommentServerSchema,
  DeleteCommentSchema,
  EditCommentSchema,
  GetCommentSchema,
} from "../validations";
import db from "@/db/db";
import { NotFoundError, UnauthorizedError } from "../errors";
import { Comment } from "@prisma/client";
import { revalidatePath } from "next/cache";
import ROUTES from "../../../constants/routes";
import { GetCommentsOutput } from "../../../types/global";

export async function getComments(
  formdata: GetCommentsParams
): Promise<ActionResponse<GetCommentsOutput[]>> {
  const validationResult = await action({ formdata, schema: GetCommentSchema });

  if (validationResult instanceof Error)
    return { success: false, error: { message: validationResult.message } };

  const { postId } = validationResult.formdata!;

  try {
    const post = await db.post.findFirst({
      where: { id: postId },
      select: { id: true },
    });
    if (!post) throw new Error("Post not found");

    const comments = await db.comment.findMany({
      where: { postId },
      include: {
        createdBy: {
          select: { name: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: comments };
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

    return { success: true, data: newComment };
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

export async function deleteComment(formdata: DeleteCommentParams) {
  const validationResult = await action({
    formdata,
    schema: DeleteCommentSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return { success: false, error: { message: validationResult.message } };

  const { authorId, commentId } = validationResult.formdata!;
  const userId = validationResult.session?.user?.id;

  if (!userId) throw new NotFoundError("User");

  try {
    if (authorId !== userId) throw new UnauthorizedError();

    const comment = await db.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) throw new Error("Comment not found");

    await db.comment.delete({
      where: { id: commentId },
    });

    return { success: true, data: commentId };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown Error",
      },
    };
  }
}

export async function editComment(formdata: EditCommentParams) {
  const validationResult = await action({
    formdata,
    schema: EditCommentSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return { success: false, error: { message: validationResult.message } };

  const { authorId, commentId, content, rating } = validationResult.formdata!;
  const userId = validationResult.session?.user?.id;

  if (!userId) throw new NotFoundError("User");

  try {
    if (userId !== authorId) throw new UnauthorizedError();

    await db.$transaction(async (tx) => {
      const comment = await tx.comment.findUnique({
        where: { id: commentId },
      });

      if (!comment) throw new Error("Comment not found");

      if (content !== comment.content || rating !== comment.rating) {
        await tx.comment.update({
          where: { id: commentId },
          data: { content, rating },
        });
      }
    });

    return { success: true, data: commentId };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown Error",
      },
    };
  }
}
