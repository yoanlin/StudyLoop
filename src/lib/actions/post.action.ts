"use server";

import { Post } from "@prisma/client";
import action from "../handlers/action";
import { CreatePostSchema } from "../validations";
import db from "@/db/db";
import { NotFoundError } from "../errors";

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
    return { success: false };
  }
}
