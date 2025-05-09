"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { CreateCommentSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { createComment } from "@/lib/actions/comment.action";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import ROUTES from "../../../constants/routes";
import { useToastStore } from "@/store/toastStore";

const Comment = ({ postId }: { postId: string }) => {
  const [isCommenting, startCommentingTransition] = useTransition();
  const { data, status } = useSession();
  const form = useForm<z.infer<typeof CreateCommentSchema>>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      content: "",
      rating: 0,
    },
    mode: "onChange",
  });
  const showToast = useToastStore((state) => state.showToast);

  const handleSubmit = async (values: z.infer<typeof CreateCommentSchema>) => {
    startCommentingTransition(async () => {
      const result = await createComment({
        postId,
        content: values.content,
        rating: values.rating,
      });

      if (result.success) {
        form.reset();
        showToast("Comment posted", "success");
      }
    });
  };

  return (
    <div>
      {data?.user && status === "authenticated" && (
        <>
          <Image
            src={data.user.image || "/fb-Avatar.png"}
            alt="avatar"
            width={40}
            height={40}
            className="inline-block size-10 rounded-full object-cover"
          />
          <span className="ml-3 text-2xl">{data.user.name}</span>
        </>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col space-y-5"
        >
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="space-x-4">
                <FormControl>
                  <div className="mt-2 flex items-center gap-5">
                    <FormLabel className="text-xl">Rating:</FormLabel>
                    <Input
                      className="inline-block h-10 w-14"
                      type="tel"
                      max={10}
                      min={1}
                      placeholder="1 ~ 10"
                      {...field}
                      {...form.register("rating", {
                        setValueAs: (value) =>
                          value === "" ? undefined : Number(value),
                      })}
                    />
                    <span> / 10</span>
                    <FormMessage className="inline-block text-xl" />
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
                    onBlur={() => form.trigger("content")}
                  />
                </FormControl>
                <FormMessage className="text-xl" />
              </FormItem>
            )}
          />
          {status === "authenticated" ? (
            <Button
              type="submit"
              className="button ml-auto w-24 text-lg md:px-14 md:text-xl"
            >
              {isCommenting ? (
                <p className="flex items-center gap-2">
                  <LoaderCircle className="animate-spin" />
                  Posting...
                </p>
              ) : (
                "Comment"
              )}
            </Button>
          ) : (
            <p className="ml-auto text-xl">
              <Link
                href={ROUTES.LOG_IN}
                className="text-fuchsia-800 underline hover:text-fuchsia-950"
              >
                Login
              </Link>{" "}
              to share your opinion
            </p>
          )}
        </form>
      </Form>
    </div>
  );
};

export default Comment;
