import { EllipsisVertical, PenLine, Trash2 } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface Props {
  postId: string;
  isAuthor: boolean;
}
const EditButton = ({ postId, isAuthor }: Props) => {
  return (
    <div className="ml-auto">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical color="#808080" size={22} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="font-markaziText">
          <DropdownMenuItem className="flex gap-5 text-lg">
            <PenLine size={22} />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex gap-5 text-lg">
            <Trash2 size={22} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default EditButton;
