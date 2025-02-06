import Image from "next/image";
import React from "react";
import { GetCommentsOutput } from "../../../types/global";
import { getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import ROUTES from "../../../constants/routes";

const CommentCard = ({ info }: { info: GetCommentsOutput }) => {
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

      <div className="ml-3">
        <Link href={ROUTES.PROFILE(info.createdById)}>
          {info.createdBy.name}
        </Link>
        <span className="ml-3 text-base text-muted">
          {getTimeStamp(info.createdAt)}
        </span>
        <p>{info.content}</p>
      </div>
      <p className="ml-auto h-fit rounded-lg border p-4 font-bold shadow">
        {info.rating}/10
      </p>
    </div>
  );
};

export default CommentCard;
