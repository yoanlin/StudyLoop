import PostForm from "@/components/form/PostForm";

const UploadPost = async () => {
  return (
    <div className="mt-8 pl-10">
      <h2 className="font-markaziText text-3xl font-black">Upload New Post</h2>

      <div className="lg:ml-24">
        <PostForm />
      </div>
    </div>
  );
};

export default UploadPost;
