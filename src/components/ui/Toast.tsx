"use client";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/toastStore";
import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const Toast = () => {
  const { toasts, removeToast, pauseTimeout, resumeTimeout } = useToastStore();
  const [hoveredToast, setHoveredToast] = useState<string | null>(null);

  return (
    <div className="fixed bottom-4 right-4 flex w-full flex-col items-center gap-2 sm:w-auto">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isHovered = hoveredToast === toast.id;
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0, x: 200 }}
              onMouseEnter={() => {
                setHoveredToast(toast.id);
                pauseTimeout(toast.id);
              }}
              onMouseLeave={() => {
                setHoveredToast(null);
                resumeTimeout(toast.id);
              }}
              className={cn(
                "w-80 h-20 rounded-md relative text-white flex flex-col justify-center shadow-lg pl-6",
                toast.type === "error"
                  ? `${isHovered ? "bg-red-500" : "bg-red-400"}`
                  : `${isHovered ? "bg-green-500" : "bg-green-400"}`
              )}
            >
              <button
                onClick={() => removeToast(toast.id)}
                className={cn("absolute right-4 top-2", !isHovered && "hidden")}
              >
                x
              </button>
              <p className="font-markaziText text-xl">{toast.message}</p>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
