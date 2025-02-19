import ProfileImageUpload from "@/components/ProfileImageUpload";
import ProfileTab from "@/components/ProfileTab";
import { getUser } from "@/lib/actions/user.action";
import Image from "next/image";
import React from "react";

const ProfilePage = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize } = await searchParams;

  return (
    <div className="flex flex-col gap-10 p-10 xl:flex-row xl:items-center">
      <ProfileCard userId={id} />
      <section className="flex w-full justify-center xl:w-[42rem] xl:self-start">
        <ProfileTab
          userId={id}
          page={Number(page)}
          pageSize={Number(pageSize)}
        />
      </section>
    </div>
  );
};

const ProfileCard = async ({ userId }: { userId: string }) => {
  const { success, data, error } = await getUser({ userId });
  if (success && data)
    return (
      <section className="flex w-full cursor-default items-center justify-around gap-5 xl:w-96 xl:flex-col xl:items-center xl:self-start xl:rounded-xl xl:border xl:bg-background xl:py-5 xl:shadow">
        <div className="relative size-auto">
          <Image
            src={data.image ? data.image : "/fb-Avatar.png"}
            alt="avatar"
            width={125}
            height={125}
            className="size-[125px] rounded-full object-cover xl:size-[200px]"
          />
          <ProfileImageUpload userId={userId} />
        </div>

        <p className="flex flex-col">
          <span className="text-xl font-black">{data.name}</span>{" "}
          <span className="text-muted xl:text-center">@{data.username}</span>
        </p>
        <p className="flex flex-col font-markaziText sm:text-xl xl:w-full xl:flex-row xl:items-center xl:justify-center xl:gap-5">
          <span>Posts: {data._count.posts}</span>
          <span>Subscription: {data._count.subscriptions}</span>
        </p>
      </section>
    );
  if (error) return <p>{error.message || "Failed to fetch user profile"}</p>;
};

export default ProfilePage;
