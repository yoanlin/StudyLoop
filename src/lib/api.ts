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
};
