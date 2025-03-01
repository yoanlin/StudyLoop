"use client";
import { Field } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import ROUTES from "../../../constants/routes";

interface Props {
  fieldInfo: Field;
}

const FieldCard = ({ fieldInfo }: Props) => {
  const [isClicked, setIsCilcked] = useState(false);
  return (
    <Link
      href={ROUTES.FIELD(fieldInfo.id)}
      className="block h-14 w-full rounded-xl border bg-stone-100 font-markaziText shadow hover:bg-stone-200 dark:bg-neutral-800 dark:hover:bg-neutral-900 lg:w-[30%]"
      onClick={() => setIsCilcked(true)}
    >
      <div className="flex size-full items-center gap-3 px-2">
        <Image
          src={isClicked ? "/chestbox-open.png" : "/chestbox.png"}
          alt="chestbox"
          width={45}
          height={45}
          className="h-auto justify-self-start object-contain"
        />
        <p className="line-clamp-1 text-center font-semibold">
          {fieldInfo.name}
        </p>
      </div>
    </Link>
  );
};

export default FieldCard;
