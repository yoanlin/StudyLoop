import { auth } from "@/auth";
import PostForm from "@/components/form/PostForm";
import { redirect } from "next/navigation";
import ROUTES from "../../../../../constants/routes";

const UploadPost = async () => {
  const session = await auth();
  if (!session) redirect(ROUTES.LOG_IN);
  return (
    <div className="mt-8 pl-10">
      <h2 className="font-markaziText text-3xl font-black lg:ml-24">
        Upload New Post
      </h2>

      <div className="lg:ml-24">
        <PostForm />
      </div>
    </div>
  );
};

export default UploadPost;
