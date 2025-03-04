"use client";
import React, { useRef, useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreatePostSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { createPost, editPost } from "@/lib/actions/post.action";
import { useRouter } from "next/navigation";
import ROUTES from "../../../constants/routes";
import { GetPostOutput } from "../../../types/global";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface Params {
  post?: GetPostOutput;
  isEdit?: boolean;
}

const PostForm = ({ post, isEdit = false }: Params) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof CreatePostSchema>>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: post?.title || "",
      field: post?.field.name || "",
      content: post?.content || "",
    },
  });

  const handleCreatePost = async (data: z.infer<typeof CreatePostSchema>) => {
    startTransition(async () => {
      if (isEdit && post) {
        const result = await editPost({ postId: post?.id, ...data });
        if (result.data) router.push(ROUTES.POST(result.data?.id));
        return;
      }
      const result = await createPost(data);
      if (result.data) router.push(ROUTES.POST(result.data?.id));
    });
  };

  return (
    <Form {...form}>
      <form
        className="mt-10 h-screen space-y-10 pr-10"
        onSubmit={form.handleSubmit(handleCreatePost)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="space-y-5">
              <FormLabel className="font-bold">Title: </FormLabel>
              <FormControl>
                <Input className="max-w-3xl" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="field"
          render={({ field }) => (
            <FormItem className="space-y-5">
              <FormLabel className="font-bold">
                What field is this learning resource?
              </FormLabel>
              <FormControl>
                <Input className="max-w-3xl" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="space-y-5">
              <FormLabel className="font-bold">
                Please share your thoughts and resources here.
              </FormLabel>
              <FormControl>
                <div className="size-full max-w-3xl overflow-hidden border">
                  <Editor
                    editorRef={editorRef}
                    value={field.value}
                    fieldChange={field.onChange}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="button mt-10 font-markaziText text-xl"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : <>{isEdit ? "Edit" : "Submit Post"}</>}
        </Button>
      </form>
    </Form>
  );
};

export default PostForm;
