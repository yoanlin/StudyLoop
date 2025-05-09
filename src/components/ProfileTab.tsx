"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "./cards/PostCard";
import { PostCardInfo, SubscribedField } from "../../types/global";
import FieldCard from "./cards/FieldCard";
import { getUserPosts } from "@/lib/actions/post.action";
import { useEffect, useState, useTransition } from "react";
import { getSubscribedFields } from "@/lib/actions/field.action";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Pagination from "./Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { removeKeysFromUrlQuery } from "@/lib/url";
import { LoaderCircle } from "lucide-react";

interface Props {
  userId: string;
  page: number;
  pageSize: number;
}
export default function ProfileTab({ userId, page, pageSize }: Props) {
  const [isPending, startTransition] = useTransition();
  const [posts, setPost] = useState<PostCardInfo[]>([]);
  const [fields, setFields] = useState<SubscribedField[]>([]);
  const [isNext, setIsNext] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"posts" | "subscriptions">(
    "posts"
  );
  const { data: session } = useSession();
  const isUser = session?.user?.id === userId;

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab as "posts" | "subscriptions");
    if (newTab !== activeTab) {
      const newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["page"],
      });

      router.push(newUrl, { scroll: false });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (activeTab === "posts") {
        const response = await getUserPosts({
          userId,
          page: page || 1,
          pageSize: pageSize || 2,
        });
        if (response.success && response.data) {
          setPost(response.data.posts);
          setIsNext(response.data.isNext);
        }
      } else if (activeTab === "subscriptions") {
        const response = await getSubscribedFields({
          userId,
          page: page || 1,
          pageSize: pageSize || 1,
        });
        if (response.success && response.data) {
          setFields(response.data.fields);
          setIsNext(response.data.isNext);
        }
      }
    };
    startTransition(fetchData);
  }, [activeTab, page, pageSize, userId]);

  return (
    <Tabs
      defaultValue="posts"
      className="w-full"
      onValueChange={handleTabChange}
    >
      <TabsList className="w-full bg-stone-200 dark:bg-stone-700">
        <TabsTrigger
          value="posts"
          className="h-full w-1/2 font-markaziText text-lg font-bold text-foreground"
        >
          Posts
        </TabsTrigger>
        <TabsTrigger
          value="subscriptions"
          className="h-full w-1/2 font-markaziText text-lg font-bold text-foreground"
        >
          Subscriptions
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts" className="relative">
        {isPending ? (
          <LoaderCircle className="absolute left-1/2 mt-40 size-9 animate-spin" />
        ) : (
          <div className="mt-10 flex flex-col items-center gap-3">
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="mt-10 flex flex-col items-center gap-4 text-xl">
                <p className="font-markaziText text-2xl">
                  There is no post yet
                </p>
                <NewpostButton isUser={isUser} />
              </div>
            )}
            <Pagination pageNumber={page ? +page : 1} isNext={isNext} />
          </div>
        )}
      </TabsContent>
      <TabsContent value="subscriptions" className="relative">
        {isPending ? (
          <LoaderCircle className="absolute left-1/2 mt-40 size-9 animate-spin" />
        ) : (
          <div className="mt-10 flex w-full flex-wrap gap-4 text-xl sm:flex-row xl:gap-8">
            {fields.length > 0 ? (
              fields.map((field) => (
                <FieldCard key={field.id} fieldInfo={field} />
              ))
            ) : (
              <p className="w-full pt-10 text-center font-markaziText text-2xl">
                There is no subscribed field yet
              </p>
            )}

            <div className="mx-auto mt-20">
              <Pagination pageNumber={page ? +page : 1} isNext={isNext} />
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

const NewpostButton = ({ isUser }: { isUser: boolean }) => {
  return (
    <Button
      className={cn(
        `button w-full font-markaziText text-lg text-black sm:w-52 xl:px-10 xl:text-xl`,
        isUser ?? "hidden"
      )}
      asChild
    >
      <Link href="/posts/upload">Create a new post</Link>
    </Button>
  );
};
