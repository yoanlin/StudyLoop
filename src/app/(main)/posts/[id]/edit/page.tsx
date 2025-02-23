import { auth } from "@/auth";
import PostForm from "@/components/form/PostForm";
import { getPost } from "@/lib/actions/post.action";
import { notFound, redirect } from "next/navigation";
import ROUTES from "../../../../../../constants/routes";

const EditPost = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();
  if (!session) return redirect("/login");

  const { data: post, success } = await getPost({ postId: id });
  if (!success) return notFound();

  if (post?.authorId !== session.user?.id) return redirect(ROUTES.POST(id));
  return (
    <main className="pl-10">
      <div className="lg:ml-24">
        <PostForm post={post} isEdit />
      </div>
    </main>
  );
};

export default EditPost;
