"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  FieldValues,
  useForm,
  DefaultValues,
  Path,
  SubmitHandler,
} from "react-hook-form";
import { Button } from "../ui/button";
import Link from "next/link";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface AuthFormProps<T extends FieldValues> {
  formType: "LOGIN" | "SIGNUP";
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<unknown>;
}

export default function AuthForm<T extends FieldValues>({
  formType,
  schema,
  defaultValues,
  onSubmit,
}: AuthFormProps<T>) {
  const { update } = useSession();
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const { success, error } = (await onSubmit(data)) as ActionResponse;

    if (success) {
      await update();
      router.push("/");
    } else {
      alert(`(Login Failed) ${error?.message}`);
    }
  };

  const buttonText = formType === "LOGIN" ? "Log In" : "Sign Up";
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<T>}
            render={({ field }) => (
              <FormItem className="mt-5">
                <FormLabel>
                  {field.name === "email"
                    ? "Email Address"
                    : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    type={field.name === "password" ? "password" : "text"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="button mt-5 w-full sm:w-auto"
        >
          {form.formState.isSubmitting
            ? buttonText === "Log In"
              ? "Logging in..."
              : "Signing up..."
            : buttonText}
        </Button>

        {formType === "LOGIN" ? (
          <p className="mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/sign_up" className="text-orange-400">
              Sign up
            </Link>
          </p>
        ) : (
          <p className="mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-400">
              Login
            </Link>
          </p>
        )}
      </form>
    </Form>
  );
}
