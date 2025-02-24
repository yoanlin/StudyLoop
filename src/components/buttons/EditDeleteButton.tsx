"use client";
import { EllipsisVertical, PenLine, Trash2 } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import ROUTES from "../../../constants/routes";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { deletePost } from "@/lib/actions/post.action";
import { useRouter } from "next/navigation";

interface Props {
  postId: string;
  authorId: string;
}
const EditDeleteButton = ({ postId, authorId }: Props) => {
  const { data: session } = useSession();
  const isAuthor = session?.user?.id === authorId;
  const router = useRouter();
  const handleDelete = async (postId: string, authorId: string) => {
    const { success, error } = await deletePost({ postId, authorId });

    if (success) {
      alert("Post has been deleted successfully");
      router.push(ROUTES.PROFILE(authorId));
    } else {
      console.error(error);
      alert("Failed to delete post");
    }
  };

  return (
    <div className={cn("ml-auto", !isAuthor && "hidden")}>
      <DropdownMenu>
        <DropdownMenuTrigger className="size-5 focus:outline-none">
          <EllipsisVertical color="#808080" size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="font-markaziText">
          <DropdownMenuItem>
            <Link
              href={ROUTES.EDIT(postId)}
              className="flex w-full items-center gap-5 text-lg"
            >
              <PenLine className="size-[16]" />
              <span>Edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleDelete(postId, authorId)}
            className="flex gap-5 text-lg"
          >
            <Trash2 size={22} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default EditDeleteButton;
