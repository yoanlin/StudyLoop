"use client";
import React, { useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const ProfileImageUpload = ({ userId }: { userId: string }) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const router = useRouter();
  const { data: session } = useSession();
  const isUser = session?.user?.id === userId;

  const handleClick = async () => {
    if (isUploading) return;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];

        if (file.size > 4.5 * 1024 * 1024) {
          alert("File size should be less than 4.5MB");
        }
        const formdata = new FormData();

        formdata.append("file", file);
        formdata.append("userId", userId);

        setIsUploading(true);

        try {
          const response = await api.users.uploadProfileImage(formdata);

          if (!response.success)
            throw new Error(
              response.error?.message || "Failed to upload image"
            );

          router.refresh();
        } catch (error) {
          console.error("Error uploading image", error);
          alert("Failed to upload image. Please try again.");
        } finally {
          setIsUploading(false);
        }
      }
    };
    fileInput.click();
  };
  return (
    <div
      onClick={handleClick}
      className={cn(
        "absolute bottom-1 right-1 box-border cursor-pointer rounded-full border border-gray-200 bg-white p-2 shadow-none",
        !isUser && "hidden"
      )}
    >
      <Image
        src={isUploading ? "/loading.png" : "/image.png"}
        alt="add image"
        width={20}
        height={20}
        className={cn("xl:size-7", isUploading && "animate-spin")}
      />
    </div>
  );
};

export default ProfileImageUpload;
