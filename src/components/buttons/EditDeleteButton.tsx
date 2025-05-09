"use client";
import { EllipsisVertical, PenLine, Trash2 } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ROUTES from "../../../constants/routes";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { deletePost } from "@/lib/actions/post.action";
import { useRouter } from "next/navigation";
import { deleteComment } from "@/lib/actions/comment.action";
import { useToastStore } from "@/store/toastStore";

interface Props {
  type: "post" | "comment";
  authorId: string;
  postId?: string;
  commentId?: string;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditDeleteButton = ({
  type,
  authorId,
  postId,
  commentId,
  setIsEditing,
}: Props) => {
  const { data: session } = useSession();
  const isAuthor = session?.user?.id === authorId;
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);

  const handleDelete = async () => {
    if (type === "post" && postId) {
      const { success, error } = await deletePost({ postId, authorId });

      if (success) {
        showToast("Post deleted successfully", "success");
        router.push(ROUTES.PROFILE(authorId));
      } else {
        console.error(error);
        showToast(`(Deletion Failed) ${error?.message}`, "error");
      }
    } else if (type === "comment" && commentId) {
      const { success, error } = await deleteComment({ commentId, authorId });

      if (success) {
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        showToast("Comment deleted successfully", "success");
      } else {
        console.error(error);
        showToast(`(Deletion Failed) ${error?.message}`, "error");
      }
    }
  };

  const handleEdit = () => {
    if (type === "post" && postId) {
      router.push(`${ROUTES.EDIT(postId)}`);
    } else if (type === "comment" && setIsEditing) {
      setIsEditing(true);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center",
        type === "post" && "ml-auto",
        !isAuthor && "hidden"
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger className="size-5 focus:outline-none">
          <EllipsisVertical color="#808080" size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="font-markaziText">
          <DropdownMenuItem onClick={handleEdit} className="flex gap-5 text-lg">
            <PenLine size={22} />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
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
