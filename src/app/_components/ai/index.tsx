"use client";

import { useState } from "react"; // Import useState
import { useTokenRiskData } from "~/lib/hooks/useTokenRiskData";
import type { TokenDataType } from "~/server/api/routers/jupiter/tokens/types";
import { Switch } from "~components/ui/switch";
import AIChatInputForm from "./components/input";
import AIMessage from "./components/message";
import { useChat } from "./hooks/useChat";

type Props = {
  token: TokenDataType | null;
};

export default function AI({ token }: Props) {
  const [isBeginnerMode, setIsBeginnerMode] = useState(true);

  const fetchTokenRiskData = useTokenRiskData();
  const {
    messages,
    chatOpen,
    userInput,
    messagesEndRef,
    handleInputChange,
    handleSendMessage,
  } = useChat(fetchTokenRiskData, token, isBeginnerMode);

  const handleToggleBeginnerMode = () => {
    setIsBeginnerMode((prev) => !prev);
  };

  return (
    <article className="flex flex-col h-full bg-background rounded-md border p-4 space-y-2 max-h-[462px]">
      <div className="flex justify-between items-center mb-2">
        <span className="mr-2">Beginner Mode</span>
        <Switch
          checked={isBeginnerMode}
          onCheckedChange={handleToggleBeginnerMode}
        />
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map(({ author, message, isLoading }, index) => (
          <AIMessage
            key={index}
            author={author}
            message={message}
            isLoading={isLoading}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {chatOpen && (
        <AIChatInputForm
          userInput={userInput}
          handleInputChange={handleInputChange}
          handleSendMessage={handleSendMessage}
        />
      )}
    </article>
  );
}
