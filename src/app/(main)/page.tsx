import Hero from "@/components/Hero";

const postInfo = [
  {
    id: 1,
    title: "Top Most Important Travel Phrases in English ",
    field: "language",
    author: "John Doe",
    avatar: "",
    createdAt: "2025-01-01",
  },
];

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center overflow-x-hidden">
      <main className="flex size-full flex-col border lg:ml-[max(40rem,calc(100vw-60rem))]">
        <Hero />
        {/* <PostCard /> */}
        <div></div>
      </main>
    </div>
  );
}
