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
