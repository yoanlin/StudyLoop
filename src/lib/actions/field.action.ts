"use server";

import { Field, Prisma } from "@prisma/client";
import { PaginatedSearchParams } from "../../../types/global";
import action from "../handlers/action";
import { PaginatedSearchParamsSchema } from "../validations";
import db from "@/db/db";

export async function getFields(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ fields: Field[]; isNext: boolean }>> {
  const validationResult = action({
    formdata: params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error)
    return { success: false, error: { message: validationResult.message } };

  const { query, filter, page = 1, pageSize = 30 } = params;

  try {
    const skip = (Number(page) - 1) * pageSize;
    const take = Number(pageSize);

    let orderBy: Prisma.FieldOrderByWithAggregationInput = {};

    switch (filter) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };

      case "popular":
        orderBy = { postCount: "desc" };
        break;
      default:
        orderBy = { postCount: "desc" };
        break;
    }

    const fields = await db.field.findMany({
      where: query ? { name: { contains: query, mode: "insensitive" } } : {},
      orderBy,
      take,
      skip,
    });

    const totalCount = await db.field.count({
      where: query ? { name: { contains: query, mode: "insensitive" } } : {},
    });

    const isNext = totalCount > skip + fields.length;

    return {
      success: true,
      data: { fields, isNext },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "unknown error",
      },
    };
  }
}
