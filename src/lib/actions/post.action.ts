"use server";

import { Post } from "@prisma/client";
import action from "../handlers/action";
import {
  CreatePostSchema,
  EditPostSchema,
  GetPostSchema,
} from "../validations";
import db from "@/db/db";
import { NotFoundError } from "../errors";
import { PostIncludeField } from "../../../types/global";

export async function createPost(
  formdata: CreatePostParams
): Promise<ActionResponse<Post>> {
  const validationResult = await action({
    formdata,
    schema: CreatePostSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return { success: false, error: { message: validationResult.message } };
  }

  const { title, field, content } = validationResult.formdata!;
  const userId = validationResult.session?.user?.id;
  if (!userId) throw new NotFoundError("User");

  const formatFieldName = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const formattedField = formatFieldName(field);

  try {
    return await db.$transaction(async (tx) => {
      let existingField = await tx.field.findUnique({
        where: { name: formattedField },
      });

      if (existingField) {
        await tx.field.update({
          where: { id: existingField.id },
          data: {
            postCount: { increment: 1 },
          },
        });
      } else {
        existingField = await tx.field.create({
          data: {
            name: formattedField,
            postCount: 1,
          },
        });
      }

      const newPost = await tx.post.create({
        data: {
          title,
          content,
          fieldId: existingField.id,
          authorId: userId,
        },
      });

      if (!newPost) throw new Error("Failed to create post");

      return { success: true, data: JSON.parse(JSON.stringify(newPost)) };
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}

export async function editPost(
  formdata: EditPostParams
): Promise<ActionResponse<Post>> {
  const validationResult = await action({
    formdata,
    schema: EditPostSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return { success: false, error: { message: validationResult.message } };
  }

  const { title, field, content, postId } = validationResult.formdata!;
  const userId = validationResult.session?.user?.id;
  if (!userId) throw new NotFoundError("User");

  const formatFieldName = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const formattedField = formatFieldName(field);

  try {
    return await db.$transaction(async (tx) => {
      const post = await tx.post.findUnique({
        where: { id: postId },
        include: { field: true },
      });
      if (!post) throw new Error("Post not found");

      if (post.authorId !== userId) throw new Error("Unauthorized");

      if (post.field.name !== formattedField) {
        const updatedField = await tx.field.upsert({
          where: { name: formattedField },
          update: { postCount: { increment: 1 } },
          create: { name: formattedField, postCount: 1 },
        });

        await tx.post.update({
          where: {
            id: postId,
          },
          data: {
            fieldId: updatedField.id,
          },
        });
      }

      if (post.title !== title || post.content !== content) {
        await tx.post.update({
          where: { id: postId },
          data: { title, content },
        });
      }

      const updatedPost = await tx.post.findUnique({
        where: { id: postId },
        include: { field: true },
      });

      return { success: true, data: JSON.parse(JSON.stringify(updatedPost)) };
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}

export async function getPost(
  formdata: GetPostParams
): Promise<ActionResponse<PostIncludeField>> {
  const validationResult = await action({
    formdata,
    schema: GetPostSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return { success: false, error: { message: validationResult.message } };
  }
  const { postId } = validationResult.formdata!;

  try {
    const post = await db.post.findUnique({
      where: { id: postId },
      include: { field: true },
    });

    if (!post) throw new Error("Post not found");

    return { success: true, data: JSON.parse(JSON.stringify(post)) };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}
