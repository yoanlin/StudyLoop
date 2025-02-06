import Image from "next/image";
import React from "react";
import { GetCommentsOutput } from "../../../types/global";
import { getTimeStamp } from "@/lib/utils";

const CommentCard = ({ info }: { info: GetCommentsOutput }) => {
  return (
    <div className="flex w-full border-y px-5 py-8">
      <Image
        src={info.createdBy.image ? info.createdBy.image : "/fb-Avatar.png"}
        alt="Avatar"
        width={30}
        height={30}
        className="size-[30px] rounded-full object-cover"
      />
      <div className="ml-3">
        <p className="inline-block">
          {info.createdBy.name}
          <span className="ml-3 text-base text-muted">
            {getTimeStamp(info.createdAt)}
          </span>
        </p>
        <p>{info.content}</p>
      </div>
    </div>
  );
};

export default CommentCard;
