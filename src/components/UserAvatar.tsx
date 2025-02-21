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

interface Props {
  id: string;
  name: string;
  imageUrl?: string | null;
  className?: string;
}

const UserAvatar = ({ id, name, imageUrl, className = "h-9 w-9" }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={32}
            height={32}
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <p>name</p>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
