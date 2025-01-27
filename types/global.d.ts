import { Field, Post } from "@prisma/client";

interface PostIncludeField extends Post {
  field: Field;
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
