import { ZodError, ZodSchema } from "zod";
import { UnauthorizedError, ValidationError } from "../errors";
import { Session } from "next-auth";
import { auth } from "@/auth";

type ActionsOptions<T> = {
  formdata?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

async function action<T>({
  formdata,
  schema,
  authorize = false,
}: ActionsOptions<T>) {
  if (formdata && schema) {
    try {
      schema.safeParse(formdata);
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(
          error.flatten().fieldErrors as Record<string, string[]>
        );
      } else {
        return new Error("Schema validation failed");
      }
    }
  }
  let session: Session | null = null;

  if (authorize) {
    session = await auth();

    if (!session) {
      return new UnauthorizedError();
    }
  }

  return { formdata, session };
}

export default action;
