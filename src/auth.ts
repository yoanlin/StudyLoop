import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { LogInSchema } from "./lib/validations";
import bcrypt from "bcryptjs";
import { api } from "./lib/api";
import { Account, User } from "@prisma/client";
import db from "./db/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(db),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LogInSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const { data: existingAccount } = (await api.accounts.getByProvider(
            email
          )) as ActionResponse<Account>;

          if (!existingAccount) return null;

          const { data: existingUser } = (await api.users.getById(
            existingAccount.userId.toString()
          )) as ActionResponse<User>;

          if (!existingUser) return null;

          const isPasswordValid = await bcrypt.compare(
            password,
            existingAccount.password!
          );
          if (!isPasswordValid) {
            console.error("Invalid password");
            return null;
          }

          if (isPasswordValid) {
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
              image: existingUser.image,
            };
          }
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "database", // 使用數據庫作為會話存儲
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  callbacks: {
    async session({ session, user }) {
      if (user) {
        session.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image || null,
          emailVerified: user.emailVerified || null,
        };
      }

      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.type === "credentials") {
        return true;
      }
      if (!account || !user) return false;

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username:
          account.provider === "github"
            ? String(profile?.login || "").replace(/\s+/g, "_")
            : String(user.name || "")
                .toLowerCase()
                .replace(/\s+/g, "_"),
      };

      const { success } = (await api.auth.oAuthLogin({
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
        user: userInfo,
      })) as ActionResponse;

      if (!success) return false;

      return true;
    },
  },
});
