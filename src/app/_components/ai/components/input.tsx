"use client";

import { PaperPlaneRight } from "@phosphor-icons/react";
import { Textarea } from "~components/ui/textarea";

type Props = {
  userInput: string;
  handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function AIChatInputForm({
  userInput,
  handleSendMessage,
  handleInputChange,
}: Props) {
  return (
    <form
      onSubmit={handleSendMessage}
      className="relative mt-2"
      aria-label="Message input form"
    >
      <Textarea
        value={userInput}
        onChange={handleInputChange}
        placeholder="Type your message..."
        aria-label="Message input"
        aria-required="true"
        className="resize-y max-h-[80px] pr-[46px]"
        rows={3}
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
        aria-label="Send message"
      >
        <PaperPlaneRight
          size={24}
          className="text-muted-foreground hover:text-muted-foreground/80"
        />
      </button>
    </form>
  );
}
