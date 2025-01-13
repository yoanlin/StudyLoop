import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import db from "./db/db";
import { LogInSchema } from "./lib/validations";
import bcrypt from "bcryptjs";
import { api } from "./lib/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
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
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = LogInSchema.safeParse(credentials);

        if (!validatedFields.success) throw new Error("Invalid input format");

        const { email, password } = validatedFields.data;

        // 查找用戶
        const user = await db.user.findUnique({
          where: { email },
          include: { accounts: true },
        });
        if (!user) throw new Error("No user found with this email");

        // 取得儲存密碼的 account
        const accountWithPassword = user.accounts.find(
          (account) => account.provider === "credentials"
        );
        if (!accountWithPassword)
          throw new Error("No credentials account found for thie user");

        // 驗證密碼
        const isPasswordValid = await bcrypt.compare(
          password,
          accountWithPassword.password!
        );
        if (!isPasswordValid) throw new Error("Invalid password");

        // 返回符合 User 類型的對象
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username:
          account.provider === "github"
            ? (profile?.login as string)
            : (user.name?.toLowerCase() as string),
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
