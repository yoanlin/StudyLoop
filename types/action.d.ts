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

interface CreatePostParams {
  title: string;
  field: string;
  content: string;
}

interface EditPostParams extends CreatePostParams {
  postId: string;
}

interface GetPostParams {
  postId: string;
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}
