import { Comment, Field, Post, User } from "@prisma/client";

interface GetPostOutput extends Post {
  field: Field;
  author: User;
  comments: Comment[];
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
