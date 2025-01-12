"use client";
import AuthForm from "@/components/form/AuthForm";
import { LogInWithCredentials } from "@/lib/actions/auth.action";
import { LogInSchema } from "@/lib/validations";
import React from "react";

const page = () => {
  return (
    <div>
      <AuthForm
        formType="LOGIN"
        defaultValues={{ email: "", password: "" }}
        schema={LogInSchema}
        onSubmit={LogInWithCredentials}
      />
    </div>
  );
};

export default page;
