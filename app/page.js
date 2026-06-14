"use client";

import ChatWidget from "./components/ChatWidget";

export default function Home() {
  return (
    <>
      {/* ── Demo landing page (backdrop for the chatbot) ──────── */}
      <main className="demo-page">
        <div className="demo-logo">
          <div className="demo-logo-circle">
            <span>qobo</span>
          </div>
          <h1>
            Qobo <em>AI Assistant</em>
          </h1>
        </div>

        <p className="demo-tagline">
          Build your professional website in 5 minutes on WhatsApp. Try our AI
          assistant — click the chat button to get started!
        </p>

        <div className="demo-features">
          <span className="demo-pill">💬 WhatsApp Builder</span>
          <span className="demo-pill">🚀 5-Min Setup</span>
          <span className="demo-pill">🤖 AI Powered</span>
          <span className="demo-pill">₹499 Starting</span>
        </div>

        <button
          className="demo-cta"
          onClick={() =>
            document.querySelector(".chat-toggle-btn")?.click()
          }
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
          Chat with Qobo AI
        </button>

        {/* Arrow pointing to the FAB */}
        <div className="demo-arrow">
          <span>Try it out!</span>
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </main>

      {/* ── The Chatbot Widget (fixed position, always mounted) ── */}
      <ChatWidget />
    </>
  );
}
