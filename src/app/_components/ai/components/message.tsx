"use client";

import { CircleNotch } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils/cn";
import type { MessagesType } from "../types/messages";

export default function AIMessage({
  author,
  message,
  isLoading,
}: MessagesType) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        damping: 10,
        stiffness: 200,
        duration: 0.1,
      }}
      className={cn("space-y-1 flex flex-col", {
        "items-end": author === "You",
      })}
    >
      <span className="text-xs text-muted-foreground">{author}</span>
      <p
        className={cn("text-sm max-w-fit rounded-md py-2 px-3", {
          "bg-secondary text-secondary-foreground whitespace-break-spaces":
            author === "Swaip",
          "bg-muted text-muted-foreground": author === "You",
          "flex items-center gap-2": isLoading,
        })}
      >
        {isLoading && <CircleNotch className="animate-spin" />}
        {message && message}
      </p>
    </motion.div>
  );
}
