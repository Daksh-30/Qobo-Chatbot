"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import "./ChatWidget.css";

/* ═══════════════════════════════════════════════════════════════
   Qobo AI Chatbot Widget
   ─ Floating button bottom-right
   ─ Expand / collapse with spring animation
   ─ Chat history with user + assistant bubbles
   ─ Calls POST /api/chat and shows typed answer
   ═══════════════════════════════════════════════════════════════ */

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Hey there! 👋 Looks like you want to build a business. I can help! Just ask me anything about creating your professional website in minutes.",
  time: formatTime(new Date()),
};

const QUICK_ACTIONS = [
  "What is Qobo?",
  "How does it work?",
  "Website pricing?",
  "Build mobile apps?",
];

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ── Auto-scroll to latest message ──────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // ── Focus input when chat opens ────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  // ── Send message ───────────────────────────────────────────────
  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    // Hide quick actions after first real message
    setShowQuickActions(false);
    setInput("");

    const userMsg = {
      role: "user",
      content: trimmed,
      time: formatTime(new Date()),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();

      const assistantMsg = {
        role: "assistant",
        content: data.answer || "I could not find that information on Qobo.",
        source: data.source || null,
        time: formatTime(new Date()),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          time: formatTime(new Date()),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ══════════════════════════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════════════════════════
  return (
    <>
      {/* ── Chat Window ─────────────────────────────────────────── */}
      <div
        className={`chat-window ${isOpen ? "visible" : ""}`}
        role="dialog"
        aria-label="Qobo AI Assistant"
      >
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-logo">
            <span>qobo</span>
          </div>
          <div className="chat-header-info">
            <div className="chat-header-title">Qobo AI Assistant</div>
            <div className="chat-header-status">Online</div>
          </div>
          <button
            className="chat-header-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {/* Welcome block (only before first user message) */}
          {messages.length === 1 && showQuickActions && (
            <div className="chat-welcome">
              <div className="chat-welcome-icon">
                <span>qobo</span>
              </div>
              <h3>Welcome to Qobo!</h3>
              <p>
                Your AI assistant for building websites and apps on WhatsApp.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.role}`}>
              <div className="chat-bubble">{msg.content}</div>
              {msg.source && (
                <div className="chat-source-tag">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.193-9.193a4.5 4.5 0 00-6.364 0l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                    />
                  </svg>
                  {msg.source}
                </div>
              )}
              <span className="chat-msg-time">{msg.time}</span>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="typing-indicator">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick action chips */}
        {showQuickActions && messages.length === 1 && (
          <div className="chat-quick-actions">
            {QUICK_ACTIONS.map((q) => (
              <button
                key={q}
                className="chat-quick-chip"
                onClick={() => sendMessage(q)}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <input
              ref={inputRef}
              className="chat-input"
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              aria-label="Type your message"
            />
          </div>
          <button
            className="chat-send-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            {/* Chat bubble icon */}
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            Send
          </button>
        </div>
      </div>

      {/* ── Floating Toggle Button ──────────────────────────────── */}
      <button
        className={`chat-toggle-btn ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
            <path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z" />
          </svg>
        )}
      </button>
    </>
  );
}
