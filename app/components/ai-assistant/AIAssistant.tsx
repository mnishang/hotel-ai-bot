"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import {
  AI_CHAT_MAX_CONTEXT_MESSAGES,
  AI_CHAT_MAX_MESSAGE_LENGTH,
  hotelKnowledge,
} from "@/lib/ai-assistant/hotelKnowledge";
import { buildLocalReply } from "@/lib/ai-assistant/localReplies";
import styles from "./AIAssistant.module.css";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: hotelKnowledge.welcomeMessage,
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const launcherRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(1);
  const sendingRef = useRef(false);
  // Once the guest types their own question, stop showing suggested replies.
  const suggestionsDisabledRef = useRef(false);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    window.setTimeout(() => launcherRef.current?.focus(), 0);
  }, []);

  // Focus the composer when opening, close with Escape, and return focus on close.
  useEffect(() => {
    if (!isOpen) return;

    const focusTimer = window.setTimeout(() => textareaRef.current?.focus(), 80);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeChat();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeChat]);

  // Keep the newest message / typing indicator in view.
  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages, isTyping, isOpen, showSuggestions]);

  // Grow the textarea up to a small maximum, then let it scroll.
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`;
  }, [input, isOpen]);

  const sendMessage = useCallback(
    async (rawText: string, fromSuggestion = false) => {
      const content = rawText.trim().slice(0, AI_CHAT_MAX_MESSAGE_LENGTH);
      if (!content || sendingRef.current) return;

      // A typed question means the guest is no longer using the suggestions.
      if (!fromSuggestion) {
        suggestionsDisabledRef.current = true;
      }

      sendingRef.current = true;
      setIsTyping(true);
      setShowSuggestions(false);

      const userMessage: ChatMessage = {
        id: `message-${Date.now()}-${messageIdRef.current++}`,
        role: "user",
        content,
      };

      const conversation = [...messages, userMessage];
      const payloadMessages = conversation
        .map(({ role, content: text }) => ({ role, content: text }))
        .slice(-AI_CHAT_MAX_CONTEXT_MESSAGES);
      const localReply = buildLocalReply(payloadMessages);

      setMessages(conversation);
      setInput("");

      let errorMessage = localReply;

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: payloadMessages,
          }),
        });

        const data = (await response.json().catch(() => null)) as
          | { reply?: unknown; error?: unknown }
          | null;

        if (!response.ok) {
          if (typeof data?.error === "string" && data.error.trim()) {
            errorMessage = data.error.trim();
          }
          throw new Error(errorMessage);
        }

        if (typeof data?.reply !== "string" || !data.reply.trim()) {
          throw new Error(localReply);
        }

        const reply = data.reply.trim();

        setMessages((current) => [
          ...current,
          {
            id: `message-${Date.now()}-${messageIdRef.current++}`,
            role: "assistant",
            content: reply,
          },
        ]);
      } catch {
        setMessages((current) => [
          ...current,
          {
            id: `message-${Date.now()}-${messageIdRef.current++}`,
            role: "assistant",
            content: errorMessage,
          },
        ]);
      } finally {
        sendingRef.current = false;
        setIsTyping(false);
        // Re-show the suggested questions only when the guest is still
        // using them. Typed questions turn them off permanently.
        if (fromSuggestion && !suggestionsDisabledRef.current) {
          setShowSuggestions(true);
        }
      }
    },
    [messages],
  );

  const handleInputKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // Let IME composition finish before sending (e.g. Japanese/Chinese input).
      if (event.nativeEvent.isComposing) return;
      event.preventDefault();
      void sendMessage(input);
    }
  };

  return (
    <>
      {isOpen && (
        <section
          id="ai-assistant-window"
          className={styles.aiaWindow}
          role="dialog"
          aria-labelledby="ai-assistant-title"
        >
          <header className={styles.aiaHeader}>
            <div className={styles.aiaHeaderIcon} aria-hidden="true">
              <MessageCircle size={18} />
            </div>
            <div className={styles.aiaHeaderText}>
              <h2 id="ai-assistant-title" className={styles.aiaTitle}>
                AI ASSISTANT
              </h2>
              <p className={styles.aiaSubtitle}>
                Room reservations &amp; guest care
              </p>
            </div>
            <button
              type="button"
              className={styles.aiaCloseButton}
              onClick={closeChat}
              aria-label="Close AI Assistant chat"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div
            ref={messagesRef}
            className={styles.aiaMessages}
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
            aria-label="Conversation with AI Assistant"
            aria-busy={isTyping}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.aiaMessageRow} ${
                  message.role === "user" ? styles.aiaMessageRowUser : ""
                }`}
              >
                {message.role === "assistant" && (
                  <div className={styles.aiaAvatar} aria-hidden="true">
                    <Sparkles size={12} />
                  </div>
                )}
                <div
                  className={`${styles.aiaBubble} ${
                    message.role === "user"
                      ? styles.aiaBubbleUser
                      : styles.aiaBubbleAssistant
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {showSuggestions && (
              <div
                className={styles.aiaSuggestions}
                aria-label="Suggested questions"
              >
                {hotelKnowledge.suggestedReplies.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className={styles.aiaSuggestion}
                    onClick={() => void sendMessage(suggestion, true)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {isTyping && (
              <div
                className={styles.aiaMessageRow}
                role="status"
                aria-label="AI Assistant is typing"
              >
                <div className={styles.aiaAvatar} aria-hidden="true">
                  <Sparkles size={12} />
                </div>
                <div
                  className={`${styles.aiaBubble} ${styles.aiaBubbleAssistant} ${styles.aiaTypingBubble}`}
                >
                  <span className={styles.aiaTypingDot} />
                  <span className={styles.aiaTypingDot} />
                  <span className={styles.aiaTypingDot} />
                  <span className={styles.aiaSrOnly}>
                    AI Assistant is typing
                  </span>
                </div>
              </div>
            )}
          </div>

          <form
            className={styles.aiaComposer}
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage(input);
            }}
          >
            <div className={styles.aiaComposerRow}>
              <label htmlFor="ai-assistant-input" className={styles.aiaSrOnly}>
                Type your message
              </label>
              <textarea
                id="ai-assistant-input"
                ref={textareaRef}
                className={styles.aiaTextarea}
                value={input}
                onChange={(event) =>
                  setInput(event.target.value.slice(0, AI_CHAT_MAX_MESSAGE_LENGTH))
                }
                onKeyDown={handleInputKeyDown}
                placeholder="Ask about rooms, rates or policies…"
                rows={1}
                maxLength={AI_CHAT_MAX_MESSAGE_LENGTH}
                aria-describedby="ai-assistant-hint"
              />
              <button
                type="submit"
                className={styles.aiaSendButton}
                aria-label="Send message"
                disabled={!input.trim() || isTyping}
              >
                <Send size={17} aria-hidden="true" />
              </button>
            </div>
            <p id="ai-assistant-hint" className={styles.aiaHint}>
              Enter to send · Shift+Enter for a new line
            </p>
          </form>
        </section>
      )}

      <button
        ref={launcherRef}
        type="button"
        className={`${styles.aiaLauncher} ${
          isOpen ? styles.aiaLauncherOpen : ""
        }`}
        onClick={() => (isOpen ? closeChat() : setIsOpen(true))}
        aria-label={
          isOpen ? "Close AI Assistant chat" : "Open AI Assistant chat"
        }
        aria-expanded={isOpen}
        aria-controls={isOpen ? "ai-assistant-window" : undefined}
        aria-haspopup="dialog"
      >
        {isOpen ? (
          <X size={18} aria-hidden="true" />
        ) : (
          <MessageCircle size={18} aria-hidden="true" />
        )}
        <span className={styles.aiaLauncherLabel}>AI ASSISTANT</span>
      </button>
    </>
  );
}
