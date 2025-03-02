"use client";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import { GetCommentsOutput } from "../../../types/global";
import { getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import ROUTES from "../../../constants/routes";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import EditDeleteButton from "../buttons/EditDeleteButton";
import { Button } from "../ui/button";
import { editComment } from "@/lib/actions/comment.action";

const CommentCard = ({ info }: { info: GetCommentsOutput }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<string>(info.content);
  const [newRating, setNewRating] = useState<number>(info.rating);
  const [isPending, startTransition] = useTransition();

  const handleEdit = () => {
    startTransition(async () => {
      const { success, error } = await editComment({
        content: newContent,
        rating: newRating,
        commentId: info.id,
        authorId: info.createdById,
      });

      if (success) {
        setIsEditing(false);
        window.location.reload();
      } else {
        alert(`(Editting Failed) ${error?.message}`);
      }
    });
  };

  return (
    <div className="flex w-full border-y px-5 py-8">
      <Link href={ROUTES.PROFILE(info.createdById)}>
        <Image
          src={info.createdBy.image ? info.createdBy.image : "/fb-Avatar.png"}
          alt="Avatar"
          width={30}
          height={30}
          className="size-[30px] rounded-full object-cover"
        />
      </Link>

      <div className="ml-3 w-full">
        <div className="flex items-center gap-1">
          <Link href={ROUTES.PROFILE(info.createdById)}>
            {info.createdBy.name}
          </Link>
          <span className="ml-3 text-base text-muted">
            {getTimeStamp(info.createdAt)}
          </span>

          {isEditing ? (
            <div className="ml-5 flex gap-2">
              <Button
                disabled={isPending}
                onClick={handleEdit}
                className="button h-8"
              >
                edit
              </Button>
              <Button
                disabled={isPending}
                onClick={() => setIsEditing(false)}
                className="h-8 border bg-background text-foreground shadow-none"
              >
                cancel
              </Button>
            </div>
          ) : (
            <EditDeleteButton
              type={"comment"}
              commentId={info.id}
              authorId={info.createdById}
              setIsEditing={setIsEditing}
            />
          )}
        </div>
        {isEditing ? (
          <div className="mt-5 flex w-full gap-5">
            <Textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="h-28 w-full resize-none text-xl focus-visible:ring-transparent"
            />
            <Input
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              className="size-16 text-center text-lg font-bold focus-visible:ring-transparent"
            />
          </div>
        ) : (
          <div className="flex w-full gap-5">
            {" "}
            <p className="mt-8">{newContent}</p>{" "}
            <p className="ml-auto flex size-16 items-center justify-center rounded-lg border font-bold shadow">
              {newRating}/10
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
