import React from "react";
import { UserWithPostCount } from "../../../types/global";
import Image from "next/image";
import Link from "next/link";
import ROUTES from "../../../constants/routes";

const UserCard = ({ user }: { user: UserWithPostCount }) => {
  return (
    <div className="flex w-32 flex-col items-center justify-center rounded-lg border bg-stone-100 py-3 font-markaziText shadow dark:bg-neutral-800">
      <Link href={ROUTES.PROFILE(user.id)}>
        <Image
          src={user.image ? user.image : "/fb-Avatar.png"}
          alt="avatar"
          width={48}
          height={48}
          className="size-12 rounded-full object-cover"
        />
        <div className="-space-y-2 text-center">
          <p className="text-xl">{user.name}</p>
          <p className="text-muted">@{user.username}</p>
          <p>Posts: {user._count.posts}</p>
        </div>
      </Link>
    </div>
  );
};

export default UserCard;
