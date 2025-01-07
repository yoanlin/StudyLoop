"use client";
import React from "react";
import { Form } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import Link from "next/link";

const AuthForm = ({ isSignUp }: { isSignUp?: boolean }) => {
  const form = useForm();
  return (
    <Form {...form}>
      <form className="flex flex-col gap-5">
        <div className="space-y-3 pt-10">
          <Label htmlFor="email" className="mt-10 text-lg">
            Email Address:
          </Label>
          <Input
            id="email"
            name="email"
            placeholder="user@example.com"
            type="email"
            required
          ></Input>
        </div>
        <div className="space-y-3 pt-5">
          <Label htmlFor="password" className="text-lg">
            Password:
          </Label>
          <Input id="password" name="password" type="password" required></Input>
        </div>

        {isSignUp && (
          <div className="space-y-3 pt-5">
            <Label htmlFor="username" className="text-xl">
              Username:
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="4 ~ 12 characters"
            ></Input>
          </div>
        )}
        <Button className="mt-5 w-full px-10 py-5 text-foreground">
          {isSignUp ? "Sign Up" : "Log In"}
        </Button>

        {isSignUp ? (
          <p>
            Already have an account?{" "}
            <Link href="/log_in" className="font-bold text-amber-500">
              Log in
            </Link>
          </p>
        ) : (
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/sign_up" className="font-bold text-amber-500">
              Sign up
            </Link>
          </p>
        )}
      </form>
    </Form>
  );
};

export default AuthForm;
