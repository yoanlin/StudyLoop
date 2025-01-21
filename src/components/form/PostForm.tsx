"use client";
import React, { useRef } from "react";
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
import { UploadPostSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const PostForm = () => {
  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof UploadPostSchema>>({
    resolver: zodResolver(UploadPostSchema),
    defaultValues: {
      title: "",
      field: "",
      content: "",
    },
  });

  return (
    <Form {...form}>
      <form className="mt-10 h-screen space-y-10 pr-10">
        <FormField
          control={form.control}
          name="title"
          render={() => (
            <FormItem className="space-y-5">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input className="max-w-[800px]" />
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
              <FormLabel>What field is this learning resource?</FormLabel>
              <FormControl>
                <Input className="max-w-[800px]" {...field} />
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
              <FormLabel>
                Please share your thoughts and resources here.
              </FormLabel>
              <FormControl>
                <Editor
                  editorRef={editorRef}
                  value={field.value}
                  fieldChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="button mt-10">Submit Post</Button>
      </form>
    </Form>
  );
};

export default PostForm;
