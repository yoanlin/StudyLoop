"use client";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toggleSavePost } from "@/lib/actions/post.action";

const CollectButton = ({ postId }: { postId: string }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isSaved, setIsSaved] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkIsSaved = async () => {
      if (!userId) return;

      try {
        const response = (await api.collections.checkCollections(
          userId,
          postId
        )) as ActionResponse<{ isSaved: boolean }>;
        if (response.success && response.data!.isSaved) {
          setIsSaved(response.data!.isSaved);
        }
      } catch (error) {
        console.error("Failed to check collection: ", error);
      }
    };

    checkIsSaved();
  }, [postId, userId]);

  const handleToggleSave = async () => {
    try {
      setIsLoading(true);
      const response = await toggleSavePost({ postId });

      if (response.success) setIsSaved(response.data!.isSaved);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
      disabled={isLoading}
    >
      <Bookmark color="#ffffff" className={cn("size-8", isSaved && "hidden")} />
      <span className={"text-foreground"}>{isSaved ? "Saved" : "Save"}</span>
    </Button>
  );
};

export default CollectButton;
