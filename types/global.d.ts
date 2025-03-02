import { Comment, Field, Post, User } from "@prisma/client";

interface GetPostOutput extends Post {
  field: Field;
  author: User;
  comments: Comment[];
  hasCommented: boolean;
}

interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}

interface PostCardInfo extends Post {
  field: {
    name: string;
    id: string;
  };
  author: {
    name: string;
    id: string;
    image: string | null;
  };
  comments: {
    rating: number;
  }[];
  _count: {
    comments: number;
  };
}

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

interface GetCommentsOutput extends Comment {
  createdBy: {
    name: string;
    image: string | null;
  };
}

interface UserWithPostCount {
  id: string;
  name: string;
  username: string;
  image: string | null;
  _count: {
    posts: number;
  };
}

interface SubscribedField {
  name: string;
  id: string;
  postCount: number;
  createdAt: Date;
}

interface GetProfileParams extends PaginatedSearchParams {
  userId: string?;
}

interface ProfileCard extends User {
  _count: {
    posts: number;
    subscriptions: number;
  };
}

interface DeletePostParams {
  postId: string;
  authorId: string;
}
