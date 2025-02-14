import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "./cards/PostCard";
import { PostCardInfo, SubscribedFields } from "../../types/global";
import FieldCard from "./cards/FieldCard";

const posts: PostCardInfo[] = [
  {
    id: "post1",
    title: "Understanding React Hooks",
    authorId: "user1",
    author: {
      id: "user1",
      name: "John Doe",
      image: "",
    },
    content: "An in-depth look at React Hooks and their usage.",
    fieldId: "field1",
    field: {
      id: "field1",
      name: "Frontend Development",
    },
    comments: [{ rating: 5 }, { rating: 4 }, { rating: 3 }],
    _count: {
      comments: 3,
    },
    collectors: [],
    createdAt: new Date("2024-01-10T10:00:00Z"),
    updatedAt: new Date("2024-01-15T12:00:00Z"),
  },
  {
    id: "post2",
    title: "Introduction to TypeScript",
    authorId: "user2",
    author: {
      id: "user2",
      name: "Jane Smith",
      image: "",
    },
    content: "Learn the basics of TypeScript and its advantages.",
    fieldId: "field2",
    field: {
      id: "field2",
      name: "Programming Languages",
    },
    comments: [{ rating: 4 }, { rating: 4 }],
    _count: {
      comments: 2,
    },
    collectors: [],
    createdAt: new Date("2024-01-12T11:30:00Z"),
    updatedAt: new Date("2024-01-16T15:00:00Z"),
  },
  {
    id: "post3",
    title: "Database Optimization Techniques",
    authorId: "user3",
    author: {
      id: "user3",
      name: "Alice Johnson",
      image: "",
    },
    content: "Techniques to optimize SQL and NoSQL databases for performance.",
    fieldId: "field3",
    field: {
      id: "field3",
      name: "Database Management",
    },
    comments: [{ rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 5 }],
    _count: {
      comments: 4,
    },
    collectors: [],
    createdAt: new Date("2024-01-14T08:45:00Z"),
    updatedAt: new Date("2024-01-17T09:20:00Z"),
  },
];

const fileds: SubscribedFields[] = [
  {
    id: "01",
    name: "Sport",
    postCount: 10,
    createdAt: new Date("2024-01-15T12:00:00Z"),
  },
  {
    id: "02",
    name: "Cooking",
    postCount: 10,
    createdAt: new Date("2024-01-15T12:00:00Z"),
  },
  {
    id: "03",
    name: "Programming",
    postCount: 18,
    createdAt: new Date("2024-01-15T12:00:00Z"),
  },
];

export default function ProfileTab({}) {
  return (
    <Tabs defaultValue="posts" className="max-w-3xl">
      <TabsList className="w-full bg-stone-200 dark:bg-stone-700">
        <TabsTrigger value="posts" className="w-1/2 text-foreground">
          Posts
        </TabsTrigger>
        <TabsTrigger value="subscriptions" className="w-1/2 text-foreground">
          Subscriptions
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <div className="mt-10 flex flex-col gap-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="subscriptions">
        <div className="mt-10 flex flex-wrap gap-3 text-xl sm:flex-row sm:justify-between">
          {fileds.map((field) => (
            <FieldCard key={field.id} fieldInfo={field} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
