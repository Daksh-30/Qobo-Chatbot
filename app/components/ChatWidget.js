"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import "./ChatWidget.css";

/* ═══════════════════════════════════════════════════════════════
   Qobo AI Chatbot Widget — styled to match Qobo.dev
   WhatsApp-inspired UI: dark green header, tailed bubbles,
   patterned background, orange round send button
   ═══════════════════════════════════════════════════════════════ */

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function today() {
  return new Date().toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Hi! I'm Qobo. 👋\n\nLooks like you want to build a business. I can help! Just ask me anything about creating your professional website in minutes.",
  time: formatTime(new Date()),
};

// Quick-action suggestion chips shown below welcome message
const QUICK_CHIPS = [
  "How does this work?",
  "What's the pricing?",
  "Can I see an example?",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ── Auto-scroll ────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // ── Focus input when chat opens ────────────────────────────────
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 350);
  }, [isOpen]);

  // ── Send message ───────────────────────────────────────────────
  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    setInput("");
    setChipsVisible(false); // hide chips once user starts chatting

    const userMsg = { role: "user", content: trimmed, time: formatTime(new Date()) };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.answer ||
            "I could not find that information on Qobo. Please contact the Qobo.dev team for assistance.\n\n📧 Email: hello@qobo.dev\n📞 Phone: +91 99011 41616",
          source: data.source || null,
          time: formatTime(new Date()),
        },
      ]);
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
        {/* ── Header ── */}
        <div className="chat-header">
          <div className="chat-header-logo">
            <Image
              src="/qobo-logo.png"
              alt="Qobo"
              width={42}
              height={42}
              style={{ borderRadius: "50%", objectFit: "cover" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fb = e.currentTarget.nextSibling;
                if (fb) fb.style.display = "flex";
              }}
            />
            <span
              className="logo-text"
              style={{
                display: "none",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              qobo
            </span>
          </div>

          <div className="chat-header-info">
            <div className="chat-header-title">Qobo AI</div>
            <div className="chat-header-status">Online</div>
          </div>

          <button
            className="chat-header-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Messages ── */}
        <div className="chat-messages">
          {/* Date divider */}
          <div className="chat-date-divider">{today()}</div>

          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.role}`}>
              <div className="chat-bubble">
                {msg.content}
                <div className="chat-msg-time">{msg.time}</div>
              </div>
              {msg.source && (
                <div className="chat-source-tag">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.193-9.193a4.5 4.5 0 00-6.364 0l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                    />
                  </svg>
                  {msg.source}
                </div>
              )}
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

        {/* ── Quick-action chips (shown until user sends first message) ── */}
        {chipsVisible && (
          <div className="chat-quick-actions">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                className="quick-chip"
                onClick={() => sendMessage(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* ── Input area ── */}
        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <input
              ref={inputRef}
              className="chat-input"
              type="text"
              placeholder="Message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              aria-label="Type your message"
            />
          </div>

          {/* Round orange send button */}
          <button
            className="chat-send-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            {/* Send / arrow icon */}
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
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
          <svg className="close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <Image
              src="/qobo-bot.png"
              alt="Chat with Qobo"
              width={64}
              height={64}
              className="bot-img"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fb = e.currentTarget.nextSibling;
                if (fb) fb.style.display = "block";
              }}
            />
            {/* Fallback icon */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ display: "none", width: 28, height: 28 }}
            >
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          </>
        )}
      </button>
    </>
  );
}
