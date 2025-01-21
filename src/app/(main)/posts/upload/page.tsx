import PostForm from "@/components/form/PostForm";
import React from "react";

const UploadPost = () => {
  return (
    <div className="mt-8 pl-10 lg:pl-[max(20rem,calc(100vw-60rem)/2)]">
      <h2 className="font-markaziText text-3xl font-black">Upload New Post</h2>

      <div className="lg:ml-24">
        <PostForm />
      </div>
    </div>
  );
};

export default UploadPost;
