"use client";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useTransition } from "react";
import { Button } from "../ui/button";
import { toggleSavePost } from "@/lib/actions/post.action";
import { redirect } from "next/navigation";
import ROUTES from "../../../constants/routes";
import { useToastStore } from "@/store/toastStore";

const CollectButton = ({ postId }: { postId: string }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isSaved, setIsSaved] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    const checkIsSaved = async () => {
      if (!userId) return;
      const { success, data, error } = (await api.collections.checkCollections(
        userId,
        postId
      )) as ActionResponse<{ isSaved: boolean }>;
      if (success && data) {
        setIsSaved(data.isSaved);
      } else {
        console.error("Failed to check collection: ", error?.message);
      }
    };

    checkIsSaved();
  }, [postId, userId]);

  const handleToggleSave = async () => {
    if (!userId) redirect(ROUTES.LOG_IN);

    startTransition(async () => {
      const { success, data, error } = await toggleSavePost({ postId });
      if (success) {
        setIsSaved(data!.isSaved);
        showToast(data!.isSaved ? "Post saved" : "Post removed", "success");
      } else {
        showToast(error?.message ?? "Operation failed", "error");
      }
    });
  };
  return (
    <Button
      className={cn(
        "font-markaziText text-lg float-end",
        isSaved
          ? "border-2 bg-white text-foreground shadow-none dark:bg-black"
          : "bg-gray-300 hover:bg-gray-400"
      )}
      onClick={handleToggleSave}
      disabled={isPending}
    >
      <Bookmark className={cn("size-8 text-foreground", isSaved && "hidden")} />
      <span className={"text-foreground"}>{isSaved ? "Saved" : "Save"}</span>
    </Button>
  );
};

export default CollectButton;
