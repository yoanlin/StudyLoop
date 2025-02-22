"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

import { toggleFieldSubscription } from "@/lib/actions/field.action";

import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import ROUTES from "../../../constants/routes";
import { Button } from "../ui/button";

const SubscribeButton = ({
  fieldId,
  otherClass,
}: {
  fieldId: string;
  otherClass?: string;
}) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!userId) return;

      try {
        console.log("try to get response...");
        const response = (await api.subscriptions.checkSubscription(
          userId,
          fieldId
        )) as ActionResponse<{ isSubscribed: boolean }>;

        console.log("API Response: ", response);

        if (response.success && response.data) {
          setIsSubscribed(response.data.isSubscribed);
        }
      } catch (error) {
        console.error("Failed to check subscription: ", error);
      }
    };

    checkSubscription();
  }, [userId, fieldId]);

  const handleToggleSubscription = async () => {
    if (!userId) return redirect(ROUTES.LOG_IN);

    setLoading(true);

    try {
      const response = await toggleFieldSubscription({ fieldId });
      if (response.success) setIsSubscribed(response.data!.isSubscribed);
    } catch (error) {
      console.error("Subscription error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(!session && "hidden", otherClass)}>
      <Button
        className={cn(
          "font-markaziText text-lg",
          isSubscribed
            ? "border-2 bg-white text-foreground shadow-none dark:bg-black"
            : "bg-gray-300 hover:bg-gray-400"
        )}
        onClick={handleToggleSubscription}
        disabled={loading}
      >
        {isSubscribed ? "Subscribed✔️" : "Subscribe"}
      </Button>
    </div>
  );
};

export default SubscribeButton;
