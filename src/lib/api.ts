import { Account, User } from "@prisma/client";
import ROUTES from "../../constants/routes";
import { fetchHandler } from "./handlers/fetch";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const api = {
  auth: {
    oAuthLogin: ({ user, provider, providerAccountId }: LoginWithOAuthParams) =>
      fetchHandler(`${API_BASE_URL}/auth/${ROUTES.LOG_IN_WITH_OAUTH}`, {
        method: "POST",
        body: JSON.stringify({ user, provider, providerAccountId }),
      }),
  },
  accounts: {
    create: (accountData: Account) =>
      fetchHandler(`${API_BASE_URL}/accounts`, {
        method: "POST",
        body: JSON.stringify(accountData),
      }),
    getByProvider: (providerAccountId: string) =>
      fetchHandler(`${API_BASE_URL}/accounts/provider`, {
        method: "POST",
        body: JSON.stringify({ providerAccountId }),
      }),
  },
  users: {
    create: (userData: User) =>
      fetchHandler(`${API_BASE_URL}/users`, {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    getById: (id: string) => fetchHandler(`${API_BASE_URL}/users/${id}`),
  },
  subscriptions: {
    checkSubscription: (userId: string, fieldId: string) =>
      fetchHandler(
        `${API_BASE_URL}/subscriptions/check?userId=${userId}&fieldId=${fieldId}`
      ),
  },
};
