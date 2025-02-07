"use server";

import db from "@/db/db";
import {
  PaginatedSearchParams,
  UserWithPostCount,
} from "../../../types/global";
import { Prisma } from "@prisma/client";

export async function getUsers(
  params: PaginatedSearchParams
): Promise<ActionResponse<UserWithPostCount[]>> {
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

    return { success: true, data: users };
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
