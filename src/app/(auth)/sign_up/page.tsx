"use client";
import AuthForm from "@/components/form/AuthForm";
import { SignUpWithCredentials } from "@/lib/actions/auth.action";
import { SignUpSchema } from "@/lib/validations";
import React from "react";

const page = () => {
  return (
    <div>
      <AuthForm
        formType="SIGNUP"
        defaultValues={{ email: "", password: "", name: "", username: "" }}
        schema={SignUpSchema}
        onSubmit={SignUpWithCredentials}
      />
    </div>
  );
};

export default page;
