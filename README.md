# 🤖 Qobo AI Chatbot

An AI-powered chatbot for [Qobo.dev](https://qobo.dev) — the WhatsApp website builder for India's businesses.

Built with **Next.js**, **React**, and **Groq AI** (Llama 3.3 70B).

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- 💬 **AI Chat Widget** — Floating chatbot with smooth expand/collapse animation
- 🧠 **Groq LLM Integration** — Natural language answers powered by Llama 3.3 70B
- 📚 **Knowledge Base** — Answers only from scraped Qobo.dev content (no hallucination)
- 📱 **Mobile Responsive** — Full-screen on mobile, widget on desktop
- ⚡ **Fast** — Groq inference + keyword-based retrieval for sub-second responses
- 🎨 **Premium UI** — Teal header, gray bubbles, orange CTA, typing indicator

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Groq API Key](https://console.groq.com/keys) (free tier available)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/qobo-chatbot.git
cd qobo-chatbot

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Groq API key

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click the chat button in the bottom-right corner.

---

## 📁 Project Structure

```
qobo-chatbot/
├── app/
│   ├── api/chat/
│   │   └── route.js          # POST /api/chat — Groq LLM + knowledge search
│   ├── components/
│   │   ├── ChatWidget.js      # React chatbot widget
│   │   └── ChatWidget.css     # Widget styles
│   ├── globals.css            # Global styles
│   ├── layout.js              # Root layout
│   └── page.js                # Landing page + ChatWidget mount
├── data/
│   └── knowledge.json         # Scraped Qobo.dev content (19 pages)
├── .env.example               # Environment variable template
├── .env.local                  # Your actual API key (git-ignored)
├── package.json
└── README.md
```

---

## 🔧 How It Works

```
User Question → Keyword Search (knowledge.json) → Top 3 Pages as Context → Groq LLM → Natural Answer
```

1. **User sends a message** via the chat widget
2. **API scores all 19 pages** from `knowledge.json` against the query using keyword matching
3. **Top 3 relevant pages** are extracted as context
4. **Context + question** are sent to Groq's Llama 3.3 70B model
5. **LLM generates a natural answer** strictly from the provided context
6. If nothing relevant is found → *"I could not find that information on Qobo."*

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key | ✅ Yes |

---

## 📝 API Reference

### `POST /api/chat`

**Request:**
```json
{
  "message": "What is Qobo?"
}
```

**Response:**
```json
{
  "answer": "Qobo is a no-code builder that allows you to create websites and apps on WhatsApp in just 5 minutes...",
  "source": "Home"
}
```

**Fallback (off-topic):**
```json
{
  "answer": "I could not find that information on Qobo.",
  "source": null
}
```

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Next.js 16 (App Router)
- **Backend:** Next.js API Routes
- **AI:** Groq Cloud (Llama 3.3 70B Versatile)
- **Styling:** Vanilla CSS with Inter font
- **Knowledge Base:** JSON (scraped from qobo.dev)

---

## 📄 License

MIT © Daksh
