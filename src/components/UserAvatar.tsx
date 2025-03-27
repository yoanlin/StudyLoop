"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { signOut } from "next-auth/react";
import Link from "next/link";
import ROUTES from "../../constants/routes";
import { useToastStore } from "@/store/toastStore";

interface Props {
  userId: string;
  name: string;
  imageUrl?: string | null;
}

const UserAvatar = ({ userId, name, imageUrl }: Props) => {
  const { showToast } = useToastStore();

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false }); // Prevent default redirection
      showToast("Logged out successfully", "success");
    } catch (error) {
      console.error("Error during sign out:", error);
      showToast("Failed to log out", "error");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Image
          src={imageUrl ? imageUrl : "/fb-Avatar.png"}
          alt={name}
          width={32}
          height={32}
          className="size-8 rounded-full object-cover"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="pt-2 font-markaziText text-xl">
        <DropdownMenuLabel className="cursor-default pl-1 font-bold">
          {name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="text-xl">
          <Link href={ROUTES.PROFILE(userId)}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2 text-xl" onClick={handleSignOut}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
