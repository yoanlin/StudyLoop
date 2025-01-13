interface LoginWithOAuthParams {
  user: {
    email: string;
    name: string;
    image: string;
    username: string;
  };
  provider: "google" | "github";
  providerAccountId: string;
}

interface AuthCredentials {
  email: string;
  password: string;
  name: string;
  username: string;
}

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};
