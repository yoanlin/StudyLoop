"use server";

import db from "@/db/db";
import { LogInSchema, SignUpSchema } from "../validations";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { NotFoundError } from "../errors";
import action from "../handlers/action";

export async function LogInWithCredentials(
  formdata: Pick<AuthCredentials, "email" | "password">
) {
  const validationResult = await action({ formdata, schema: LogInSchema });

  if (validationResult instanceof Error) {
    throw new Error(`Error: ${validationResult.message}`);
  }

  const { email, password } = validationResult.formdata!;

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
      include: {
        accounts: {
          where: { provider: "credentials" },
          select: { password: true },
        },
      },
    });

    if (!existingUser) throw new NotFoundError("User");

    const accountWithPassword = existingUser.accounts[0];
    if (!accountWithPassword || !accountWithPassword.password) {
      throw new NotFoundError("Account");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      accountWithPassword.password
    );

    if (!isPasswordValid) {
      console.error(`Login failed: Invalid password for user ${email}`);
      throw new Error("Invalid password");
    }

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function SignUpWithCredentials(formdata: AuthCredentials) {
  const validationResult = await action({ formdata, schema: SignUpSchema });

  if (validationResult instanceof Error) {
    throw new Error(`Error: ${validationResult.message}`);
  }

  const { email, password, name, username } = validationResult.formdata!;

  try {
    await db.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { email },
      });
      if (existingUser) throw new Error("User already exists");

      const existingUsername = await tx.user.findUnique({
        where: { username },
      });
      if (existingUsername) throw new Error("Username already exists");

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await tx.user.create({
        data: { email, name, username },
      });

      await tx.account.create({
        data: {
          userId: newUser.id,
          type: "credentials",
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      });

      await signIn("credentials", { email, password, redirect: false });

      return { success: true };
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
