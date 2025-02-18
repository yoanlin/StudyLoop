"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "./cards/PostCard";
import { PostCardInfo, SubscribedField } from "../../types/global";
import FieldCard from "./cards/FieldCard";
import { getUserPosts } from "@/lib/actions/post.action";
import { useEffect, useState } from "react";
import { getSubscribedFields } from "@/lib/actions/field.action";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  userId: string;
  page: number;
  pageSize: number;
}
export default function ProfileTab({ userId, page, pageSize }: Props) {
  const [posts, setPost] = useState<PostCardInfo[]>([]);
  const [fields, setFields] = useState<SubscribedField[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "subscriptions">(
    "posts"
  );
  const { data: session } = useSession();
  const isUser = session?.user?.id === userId;

  useEffect(() => {
    const fetchData = async () => {
      if (activeTab === "posts") {
        const response = await getUserPosts({
          userId,
          page: page || 1,
          pageSize: pageSize || 10,
        });
        if (response.success && response.data) setPost(response.data.posts);
      } else if (activeTab === "subscriptions") {
        const response = await getSubscribedFields({
          userId,
          page: page || 1,
          pageSize: pageSize || 10,
        });
        if (response.success && response.data) setFields(response.data.fields);
      }
    };
    fetchData();
  }, [activeTab, page, pageSize, userId]);

  return (
    <Tabs
      defaultValue="posts"
      className="w-full"
      onValueChange={(value) =>
        setActiveTab((value as "posts") || "subscriptions")
      }
    >
      <TabsList className="w-full bg-stone-200 dark:bg-stone-700">
        <TabsTrigger value="posts" className="w-1/2 text-foreground">
          Posts
        </TabsTrigger>
        <TabsTrigger value="subscriptions" className="w-1/2 text-foreground">
          Subscriptions
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <div className="mt-10 flex flex-col items-center gap-3">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="mt-10 flex flex-col items-center gap-4 text-xl">
              <p className="font-markaziText text-2xl">There is no post yet</p>
              <NewpostButton isUser={isUser} />
            </div>
          )}
        </div>
      </TabsContent>
      <TabsContent value="subscriptions">
        <div className="mt-10 flex flex-wrap gap-4 text-xl sm:flex-row xl:gap-8">
          {fields.length > 0 ? (
            fields.map((field) => (
              <FieldCard key={field.id} fieldInfo={field} />
            ))
          ) : (
            <p className="mx-auto mt-10 font-markaziText text-2xl">
              There is no subscribed field yet
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}

const NewpostButton = ({ isUser }: { isUser: boolean }) => {
  return (
    <Button
      className={cn(
        `button w-full font-markaziText text-lg text-black sm:w-52 xl:px-10 xl:text-xl`,
        !isUser && "hidden"
      )}
      asChild
    >
      <Link href="/posts/upload">Create a new post</Link>
    </Button>
  );
};
