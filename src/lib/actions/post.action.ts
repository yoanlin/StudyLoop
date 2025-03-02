"use server";

import { Post } from "@prisma/client";
import action from "../handlers/action";
import {
  CollectionSchema,
  CreatePostSchema,
  DeletePostSchema,
  EditPostSchema,
  GetPostSchema,
  GetUserProfileSchema,
  PaginatedSearchParamsSchema,
} from "../validations";
import db from "@/db/db";
import { NotFoundError, UnauthorizedError } from "../errors";
import {
  PaginatedSearchParams,
  PostCardInfo,
  GetPostOutput,
  GetProfileParams,
  DeletePostParams,
} from "../../../types/global";
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
): Promise<ActionResponse<GetPostOutput>> {
  const validationResult = await action({
    formdata,
    schema: GetPostSchema,
  });

  if (validationResult instanceof Error) {
    return { success: false, error: { message: validationResult.message } };
  }
  const { postId, userId } = validationResult.formdata!;

  try {
    const post = await db.post.findUnique({
      where: { id: postId },
      include: { field: true, author: true, comments: true },
    });

    if (!post) throw new Error("Post not found");

    const hasCommented = post.comments.some(
      (comment) => comment.createdById === userId
    );

    return { success: true, data: { ...post, hasCommented } };
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
): Promise<ActionResponse<{ posts: PostCardInfo[]; isNext: boolean }>> {
  const validationResult = await action({
    formdata: params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error)
    return {
      success: false,
      error: { message: validationResult.message },
    };

  const {
    query,
    page = 1,
    pageSize = 10,
    filter,
    sort: fieldId,
  } = validationResult.formdata!;

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

    // Only posts belonging to the specified field are returned
    if (fieldId) {
      whereConditions = {
        ...whereConditions,
        fieldId,
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
      orderBy:
        filter === "newest" ? { createdAt: "desc" } : { createdAt: "asc" },
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

export async function toggleSavePost(
  params: CollectionParams
): Promise<ActionResponse<{ isSaved: boolean }>> {
  const validationResult = await action({
    formdata: params,
    schema: CollectionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return { success: false, error: { message: validationResult.message } };

  const { postId } = validationResult.formdata!;
  const userId = validationResult.session?.user?.id;

  if (!userId) throw new NotFoundError("User");

  try {
    const post = await db.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundError("Post");

    const existingCollection = await db.postCollector.findFirst({
      where: { postId, userId },
    });

    if (existingCollection) {
      await db.postCollector.delete({ where: { id: existingCollection.id } });
      return { success: true, data: { isSaved: false } };
    } else {
      await db.postCollector.create({ data: { userId, postId } });
      return { success: true, data: { isSaved: true } };
    }
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

export async function getCollectedPosts(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ posts: PostCardInfo[]; isNext: boolean }>> {
  const validationResult = await action({
    formdata: params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return {
      success: false,
      error: { message: validationResult.message },
    };

  const { query, page = 1, pageSize = 10, filter } = validationResult.formdata!;

  const userId = validationResult.session?.user?.id;
  if (!userId) throw new NotFoundError("User");

  try {
    const skip = (Number(page) - 1) * pageSize;
    const take = Number(pageSize);

    // Get all collected post IDs
    const collectedPostIds = await db.postCollector.findMany({
      where: { userId },
      select: { postId: true },
    });

    const postIds = collectedPostIds.map((p) => p.postId);
    if (postIds.length === 0)
      return { success: true, data: { posts: [], isNext: false } };

    // Calculate average rating for posts that have comments
    const postRatingsMap = new Map<string, number>();

    if (filter === "top_rated") {
      const postRatings = await db.comment.groupBy({
        by: ["postId"],
        _avg: { rating: true },
        where: { postId: { in: postIds } }, // Only look at collected posts
      });

      postRatings.forEach((pr) => {
        postRatingsMap.set(pr.postId, pr._avg.rating ?? 0);
      });

      // Ensure posts with no comments have rating = 0
      postIds.forEach((id) => {
        if (!postRatingsMap.has(id)) postRatingsMap.set(id, 0);
      });

      // Sort postIds by average rating descending
      postIds.sort((a, b) => postRatingsMap.get(b)! - postRatingsMap.get(a)!);
    }

    // Construct where conditions
    const whereConditions: Prisma.PostWhereInput = { id: { in: postIds } };

    if (query) {
      whereConditions.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ];
    }

    // Fetch collected posts in correct order
    const posts = await db.post.findMany({
      where: whereConditions,
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        field: {
          select: { id: true, name: true },
        },
        _count: { select: { comments: true } },
        comments: { select: { rating: true } },
      },
      orderBy:
        filter === "newest" ? { createdAt: "desc" } : { createdAt: "asc" },
      take,
      skip,
    });

    const isNext = postIds.length > skip + posts.length;

    return { success: true, data: { posts, isNext } };
  } catch (error) {
    console.error("Error fetching collected posts: ", error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "unknown error",
      },
    };
  }
}

export async function getUserPosts(
  params: GetProfileParams
): Promise<ActionResponse<{ posts: PostCardInfo[]; isNext: boolean }>> {
  const validationResult = await action({
    formdata: params,
    schema: GetUserProfileSchema,
  });

  if (validationResult instanceof Error)
    return { success: false, error: { message: validationResult.message } };

  const { userId, page = 1, pageSize = 10 } = validationResult.formdata!;
  if (!userId) throw new NotFoundError("User");

  try {
    const take = pageSize;
    const skip = (page - 1) * pageSize;

    const posts = await db.post.findMany({
      where: { authorId: userId },
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
      take,
      skip,
    });

    const totalPosts = await db.post.count({ where: { authorId: userId } });
    const isNext = totalPosts > skip + posts.length;

    return { success: true, data: { posts, isNext } };
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

export async function deletePost(
  params: DeletePostParams
): Promise<ActionResponse<string>> {
  const validationResult = await action({
    formdata: params,
    schema: DeletePostSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return { success: false, error: { message: validationResult.message } };
  }

  const { postId, authorId } = validationResult.formdata!;
  const userId = validationResult.session?.user?.id;
  if (!userId) throw new NotFoundError("User");

  try {
    if (userId !== authorId) throw new UnauthorizedError();

    const post = await db.post.findUnique({
      where: { id: postId },
      select: { fieldId: true },
    });
    if (!post) throw new Error("Post not found");

    const fieldId = post.fieldId;

    await db.$transaction(async (tx) => {
      await Promise.all([
        await tx.comment.deleteMany({ where: { postId } }),
        await tx.postCollector.deleteMany({ where: { postId } }),
      ]);

      await tx.post.delete({ where: { id: postId } });

      const remainingPosts = await tx.post.count({
        where: { fieldId },
      });

      if (remainingPosts === 0) {
        await Promise.all([
          tx.field.delete({ where: { id: fieldId } }),
          tx.userSubscription.deleteMany({ where: { fieldId } }),
        ]);
      } else {
        await tx.field.update({
          where: { id: post.fieldId },
          data: { postCount: remainingPosts },
        });
      }
    });

    return { success: true, data: postId };
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
