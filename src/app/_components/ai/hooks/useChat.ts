"use client";

import { useEffect, useRef, useState } from "react";
import type { TokenDataType } from "~/server/api/routers/jupiter/tokens/types";
import type { MessagesType } from "../types/messages";
import { SwaipAI } from "../utils/swaip-ai";

export const useChat = (
  fetchTokenRiskData: (token: TokenDataType) => Promise<any>, // eslint-disable-line
  token: TokenDataType | null,
) => {
  const [messages, setMessages] = useState<MessagesType[]>([
    {
      author: "Swaip",
      message: "To begin, select a token to buy.",
    },
  ]);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const swaipAI = new SwaipAI();

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setMessages((prev) => [
        ...prev,
        {
          author: "You",
          message: `How risky is it to buy ${token.symbol}?`,
        },
      ]);

      const riskAssessmentMessage: MessagesType = {
        author: "Swaip",
        message: "Swaip is thinking...",
        isLoading: true,
      };
      setMessages((prev) => [...prev, riskAssessmentMessage]);

      try {
        const data = await fetchTokenRiskData(token);
        const textStream = await swaipAI.getRiskAssessment(data, token); // eslint-disable-line

        let finalMessage = "";

        for await (const textPart of textStream) {
          finalMessage += textPart;

          setMessages((prev) => {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1] = {
              author: "Swaip",
              message: finalMessage,
              isLoading: false,
            };
            return updatedMessages;
          });
        }

        setMessages((prev) => [
          ...prev,
          {
            author: "Swaip",
            message: "Feel free to ask any further questions!",
          },
        ]);
        setChatOpen(true);
      } catch (error) {
        console.error(error);
        setMessages((prev) => {
          const updatedMessages = [...prev];
          const loadingMessageIndex = updatedMessages.length - 1;
          updatedMessages[loadingMessageIndex] = {
            author: "Swaip",
            message: (error as Error).message,
            isLoading: false,
          };
          return updatedMessages;
        });
      }
    };

    fetchData(); // eslint-disable-line
  }, [token]); // eslint-disable-line

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userInput.trim()) {
      const newMessage = { author: "You", message: userInput } as MessagesType;
      setMessages((prev) => [...prev, newMessage]);
      setUserInput("");

      const aiMessage: MessagesType = {
        author: "Swaip",
        message: "Swaip is thinking...",
        isLoading: true,
      };
      setMessages((prev) => [...prev, aiMessage]);

      try {
        const textStream = await swaipAI.respondToQuestion(userInput);

        let finalAIMessage = "";

        for await (const textPart of textStream) {
          finalAIMessage += textPart;
        }

        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            author: "Swaip",
            message: finalAIMessage,
            isLoading: false,
          };
          return updatedMessages;
        });
      } catch (error) {
        console.error(error);
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            author: "Swaip",
            message: (error as Error).message,
            isLoading: false,
          };
          return updatedMessages;
        });
      }
    }
  };

  return {
    messages,
    chatOpen,
    userInput,
    messagesEndRef,
    handleInputChange,
    handleSendMessage,
  };
};
