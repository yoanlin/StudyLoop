"use server";

import { Field, Prisma } from "@prisma/client";
import {
  GetProfileParams,
  PaginatedSearchParams,
  SubscribedField,
} from "../../../types/global";
import action from "../handlers/action";
import {
  GetUserProfileSchema,
  PaginatedSearchParamsSchema,
  SubscribeSchema,
} from "../validations";
import db from "@/db/db";
import { NotFoundError } from "../errors";

export async function getFields(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ fields: Field[]; isNext: boolean }>> {
  const validationResult = action({
    formdata: params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error)
    return { success: false, error: { message: validationResult.message } };

  const { query, filter, page = 1, pageSize = 9 } = params;

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

export async function toggleFieldSubscription(
  params: SubscribeParams
): Promise<ActionResponse<{ isSubscribed: boolean }>> {
  const validationResult = await action({
    formdata: params,
    schema: SubscribeSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return { success: false, error: { message: validationResult.message } };

  const { fieldId } = validationResult.formdata!;
  const userId = validationResult.session?.user?.id;
  if (!userId) throw new NotFoundError("User");

  try {
    const field = await db.field.findUnique({
      where: { id: fieldId },
    });
    if (!field) throw new Error("Field not found");

    const existingSubscription = await db.userSubscription.findFirst({
      where: { userId, fieldId },
    });

    if (existingSubscription) {
      await db.userSubscription.delete({
        where: { id: existingSubscription.id },
      });
      return { success: true, data: { isSubscribed: false } };
    } else {
      await db.userSubscription.create({ data: { userId, fieldId } });
      return { success: true, data: { isSubscribed: true } };
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

export async function getSubscribedFields(
  params: GetProfileParams
): Promise<ActionResponse<{ fields: SubscribedField[]; isNext: boolean }>> {
  const validationResult = await action({
    formdata: params,
    schema: GetUserProfileSchema,
    authorize: true,
  });
  if (validationResult instanceof Error)
    return { success: false, error: { message: validationResult.message } };

  const { query, page = 1, pageSize = 12 } = validationResult.formdata!;

  const finalUserId = params.userId || validationResult.session?.user?.id;
  if (!finalUserId) throw new NotFoundError("User");

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereConditions: any = { userId: finalUserId };

    if (query) {
      whereConditions.field = {
        name: { contains: query, mode: "insensitive" },
      };
    }
    const subscribedFields = await db.userSubscription.findMany({
      where: whereConditions,
      include: { field: true },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    const totalCount = await db.userSubscription.count({
      where: whereConditions,
    });
    const isNext = totalCount > page * pageSize;

    return {
      success: true,
      data: { fields: subscribedFields.map((sub) => sub.field), isNext },
    };
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
