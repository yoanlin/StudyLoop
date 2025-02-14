import ProfileTab from "@/components/ProfileTab";
import Image from "next/image";
import React from "react";

const data = {
  _id: {
    $oid: "6790ca34f2eeeffd89fdf95f",
  },
  email: "yoanlin068@gmail.com",
  name: "Yoan Lin",
  username: "yoan lin",
  image: "",
  providers: ["google"],
  createdAt: {
    $date: "2025-01-22T10:36:36.651Z",
  },
  updatedAt: {
    $date: "2025-01-22T10:36:36.651Z",
  },
};
const ProfilePage = () => {
  return (
    <div className="flex flex-col gap-10  p-10 xl:flex-row xl:items-center">
      <section className="flex w-full cursor-default items-center justify-around gap-5 xl:w-96 xl:flex-col xl:items-center xl:self-start xl:rounded-xl xl:border xl:bg-background xl:py-5 xl:shadow">
        <Image
          src={data.image ? data.image : "/fb-Avatar.png"}
          alt="avatar"
          width={125}
          height={125}
          className="rounded-full xl:size-[200px]"
        />
        <p className="flex flex-col">
          <span className="text-xl font-black">{data.name}</span>{" "}
          <span className="text-muted xl:text-center">@{data.username}</span>
        </p>
        <p className="flex flex-col font-markaziText sm:text-xl xl:w-full xl:flex-row xl:items-center xl:justify-center xl:gap-5">
          <span>Posts: 25</span>
          <span>Subscription: 12</span>
        </p>
      </section>

      <section className="xl:w-[48rem] xl:self-start">
        <ProfileTab />
      </section>
    </div>
  );
};

export default ProfilePage;
