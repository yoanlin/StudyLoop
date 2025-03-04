import React from "react";
import { UserWithPostCount } from "../../../types/global";
import Image from "next/image";
import Link from "next/link";
import ROUTES from "../../../constants/routes";

const UserCard = ({ user }: { user: UserWithPostCount }) => {
  return (
    <div className="flex w-[calc(50%-10px)] justify-center rounded-lg bg-stone-100 py-3 font-markaziText shadow  dark:bg-neutral-800 sm:w-[30%] lg:w-[calc(25%-15px)]">
      <Link
        className="flex flex-col items-center"
        href={ROUTES.PROFILE(user.id)}
      >
        <Image
          src={user.image ? user.image : "/fb-Avatar.png"}
          alt="avatar"
          width={48}
          height={48}
          className="size-12 rounded-full object-cover"
        />
        <div className="-space-y-1 text-center">
          <p className="text-xl">{user.name}</p>
          <p className="text-muted">@{user.username}</p>
          <p>Posts: {user._count.posts}</p>
        </div>
      </Link>
    </div>
  );
};

export default UserCard;
