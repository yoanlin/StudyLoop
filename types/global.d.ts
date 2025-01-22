import { Field, Post } from "@prisma/client";

interface PostIncludeField extends Post {
  field: Field;
}
