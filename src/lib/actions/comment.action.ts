"use server";

import action from "../handlers/action";
import { GetCommentSchema } from "../validations";

export async function getComments(formdata: GetCommentsParams) {
  const validationResult = await action({ formdata, schema: GetCommentSchema });

  if (validationResult instanceof Error)
    return { success: false, error: { message: validationResult.message } };

  const { postId } = validationResult.formdata;

  try {
  } catch (error) {
    console.log(error);
    if (error instanceof Error)
      return { success: false, error: { message: error.message } };
  }
}
