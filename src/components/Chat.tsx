import { useEffect, useRef, useState } from "react";
import styles from "./Chat.module.css";

type Message = { role: "user" | "agent"; content: string };

const SUGGESTED = [
  "What AI systems has he built?",
  "Tell me about his AWS background",
  "Is he open to contracts?",
];

const TOOL_STEPS = [
  "searching resume",
  "retrieving project context",
  "composing answer",
];

const CONTACT_EMAIL = "jpbeluca@gmail.com";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      content:
        "Hi — I'm an AI assistant trained on John's experience. Ask me anything about his work, projects, or availability.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toolStep, setToolStep] = useState<string | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, loading, toolStep]);

  async function ask(q?: string) {
    if (loading) return;
    const question = (q ?? input).trim();
    if (!question) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", content: question }]);
    setLoading(true);

    for (const t of TOOL_STEPS) {
      setToolStep(t);
      await new Promise((r) => setTimeout(r, 280));
    }
    setToolStep(null);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error(`agent ${res.status}`);
      const data = (await res.json()) as { answer?: string };
      const reply =
        data.answer?.trim() ||
        `Sorry, I can't reach the model right now. Email John directly: ${CONTACT_EMAIL}`;
      setMessages((m) => [...m, { role: "agent", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "agent",
          content: `Sorry, I can't reach the model right now. Email John directly: ${CONTACT_EMAIL}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.headerDot} aria-hidden="true" />
        <span className={styles.headerTitle}>ask the agent</span>
        <span className={styles.headerMeta}>claude · RAG over resume</span>
      </div>

      <div ref={messagesRef} className={styles.messages}>
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className={styles.userMsg}>
              <div className={styles.userBubble}>{m.content}</div>
            </div>
          ) : (
            <div key={i} className={styles.agentMsg}>
              <div className={styles.agentAvatar} aria-hidden="true">
                b
              </div>
              <div className={styles.agentText}>{m.content}</div>
            </div>
          ),
        )}
        {toolStep && (
          <div className={styles.toolLine}>
            <span className={styles.toolStep}>→ {toolStep}</span>
            <span className={styles.dot} aria-hidden="true" />
          </div>
        )}
        {loading && !toolStep && (
          <div className={styles.generatingLine}>
            generating
            <span className={styles.dot} aria-hidden="true" />
          </div>
        )}
      </div>

      <div className={styles.footer}>
        {messages.length <= 1 && (
          <div className={styles.suggested}>
            {SUGGESTED.map((q) => (
              <button
                key={q}
                type="button"
                className={styles.pill}
                onClick={() => ask(q)}
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>
        )}
        <div className={styles.inputBar}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") ask();
            }}
            placeholder="Ask the agent…"
            disabled={loading}
            className={styles.input}
            aria-label="Ask the agent"
          />
          <button
            type="button"
            onClick={() => ask()}
            disabled={loading || !input.trim()}
            className={styles.send}
          >
            send ↵
          </button>
        </div>
      </div>
    </div>
  );
}
