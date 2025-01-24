"use server";

import { Post } from "@prisma/client";
import action from "../handlers/action";
import {
  CreatePostSchema,
  EditPostSchema,
  GetPostSchema,
  PaginatedSearchParamsSchema,
} from "../validations";
import db from "@/db/db";
import { NotFoundError } from "../errors";
import { PaginatedSearchParams, PostIncludeField } from "../../../types/global";
import { Prisma } from "@prisma/client";

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

export async function getPosts(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ posts: Post[]; isNext: boolean }>> {
  const validationResult = await action({
    formdata: params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error)
    return {
      success: false,
      error: { message: validationResult.message },
    };

  const { query, page = 1, pageSize = 10, filter } = params;

  try {
    // Pagination calculation
    const skip = (Number(page) - 1) * pageSize;
    const take = Number(pageSize);

    // Query to get post IDs if "top_rated" is selected
    let postIds: string[] = [];

    if (filter === "top_rated") {
      const postRatings = await db.comment.groupBy({
        by: "postId",
        _avg: {
          rating: true,
        },
        orderBy: {
          _avg: {
            rating: "desc",
          },
        },
        take,
        skip,
      });

      postIds = postRatings.map((pr) => pr.postId);
    }

    // Construct where condition based on query string
    let whereConditions: Prisma.PostWhereInput = {};

    if (query) {
      whereConditions = {
        ...whereConditions,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      };
    }
    if (filter === "top_rated" && postIds.length > 0) {
      whereConditions.id = { in: postIds };
    }

    // Query posts based on the filter type (newest or top_rated)
    const posts = await db.post.findMany({
      where: whereConditions,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        field: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: { comments: true },
        },
        comments: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: filter === "newest" ? { createdAt: "desc" } : undefined,
      take,
      skip,
    });

    // Check if there are more posts for pagination
    const totalPosts = await db.post.count({ where: whereConditions });
    const isNext = totalPosts > skip + posts.length;

    return {
      success: true,
      data: { posts, isNext },
    };
  } catch (error) {
    console.error("Error fetching posts: ", error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "unknown error",
      },
    };
  }
}
