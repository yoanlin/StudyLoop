"use client";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { z } from "zod";
import { CreateCommentSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "../ui/button";

const Comment = () => {
  const { data, status } = useSession();
  const form = useForm<z.infer<typeof CreateCommentSchema>>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      content: "",
      rating: 0,
    },
  });
  return (
    <div>
      {data?.user && status === "authenticated" && (
        <>
          <Image
            src={data.user.image || "/fb-Avatar.png"}
            alt="avatar"
            width={40}
            height={40}
            className="inline-block rounded-full"
          />
          <span className="ml-3 text-2xl">{data.user.name}</span>
        </>
      )}
      <Form {...form}>
        <form className="space-y-5">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="space-x-4">
                <FormLabel className="text-xl">Rating:</FormLabel>
                <FormControl>
                  <div className="inline-block">
                    <Input
                      className="inline-block h-10 w-20"
                      type="tel"
                      max={10}
                      min={1}
                      placeholder="1 ~ 10"
                      {...field}
                    />
                    <span> / 10</span>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-2xl">Leave a comment</FormLabel>
                <FormControl>
                  <Textarea
                    className="h-28 resize-none text-xl focus-visible:ring-transparent"
                    {...field}
                  ></Textarea>
                </FormControl>
              </FormItem>
            )}
          />
          <Button className="button absolute right-10 top-[110px] w-24 text-lg md:px-14 md:text-xl">
            Comment
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Comment;
