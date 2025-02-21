"use server";

import db from "@/db/db";
import {
  PaginatedSearchParams,
  ProfileCard,
  UserWithPostCount,
} from "../../../types/global";
import { Prisma } from "@prisma/client";
import action from "../handlers/action";
import { UserIdSchema } from "../validations";
import { NotFoundError } from "../errors";

export async function getUsers(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ users: UserWithPostCount[] }>> {
  const { query } = params;

  const whereConditions: Prisma.UserWhereInput = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { username: { contains: query, mode: "insensitive" } },
        ],
      }
    : {};

  try {
    const users = await db.user.findMany({
      where: whereConditions,
      take: 15,
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: { posts: true },
        },
      },
    });

    return { success: true, data: { users } };
  } catch (error) {
    console.log("Error fetching top users:", error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}

export async function getUser(
  params: UserId
): Promise<ActionResponse<ProfileCard>> {
  const validationResult = await action({
    formdata: params,
    schema: UserIdSchema,
  });

  if (validationResult instanceof Error)
    return { success: false, error: { message: validationResult.message } };

  const { userId } = validationResult.formdata!;

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: { posts: true, subscriptions: true },
        },
      },
    });

    if (!user) throw new NotFoundError("User");

    return { success: true, data: user };
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
