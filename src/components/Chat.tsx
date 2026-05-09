import { useEffect, useRef, useState } from "react";
import styles from "./Chat.module.css";

type Message = { role: "user" | "agent"; content: string };

const SUGGESTED = [
  "What AI systems has he built?",
  "Tell me about his AWS background",
  "Is he open to contracts?",
];

const CONTACT_EMAIL = "jpbeluca@gmail.com";
const FALLBACK_REPLY = `Sorry, I can't reach the model right now. Email John directly: ${CONTACT_EMAIL}`;

type SSEEvent = { chunk?: string; replace?: string; done?: boolean };

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
  const [streaming, setStreaming] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, loading]);

  function appendToLastAgent(setter: (prev: string) => string) {
    setMessages((m) => {
      const next = [...m];
      const last = next[next.length - 1];
      if (last && last.role === "agent") {
        next[next.length - 1] = { ...last, content: setter(last.content) };
      }
      return next;
    });
  }

  async function ask(q?: string) {
    if (loading) return;
    const question = (q ?? input).trim();
    if (!question) return;

    setInput("");
    setMessages((m) => [
      ...m,
      { role: "user", content: question },
      { role: "agent", content: "" },
    ]);
    setLoading(true);
    setStreaming(false);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (res.status === 429) {
        appendToLastAgent(() => FALLBACK_REPLY);
        return;
      }
      if (!res.ok || !res.body) {
        throw new Error(`agent ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let gotAnything = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE events are delimited by \n\n
        let idx: number;
        while ((idx = buffer.indexOf("\n\n")) !== -1) {
          const rawEvent = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          const dataLines = rawEvent
            .split("\n")
            .filter((l) => l.startsWith("data:"))
            .map((l) => l.slice(5).replace(/^ /, ""));
          if (dataLines.length === 0) continue;
          const dataStr = dataLines.join("\n");
          let evt: SSEEvent;
          try {
            evt = JSON.parse(dataStr) as SSEEvent;
          } catch {
            continue;
          }
          if (typeof evt.chunk === "string") {
            const chunk = evt.chunk;
            if (!gotAnything) {
              gotAnything = true;
              setStreaming(true);
            }
            appendToLastAgent((prev) => prev + chunk);
          } else if (typeof evt.replace === "string") {
            const replacement = evt.replace;
            gotAnything = true;
            setStreaming(true);
            appendToLastAgent(() => replacement);
          }
          if (evt.done) {
            setStreaming(false);
          }
        }
      }

      if (!gotAnything) {
        appendToLastAgent(() => FALLBACK_REPLY);
      }
    } catch {
      appendToLastAgent((prev) => (prev ? prev : FALLBACK_REPLY));
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  }

  const showThinking =
    loading &&
    !streaming &&
    messages.length > 0 &&
    messages[messages.length - 1]?.role === "agent" &&
    messages[messages.length - 1]?.content === "";

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.headerDot} aria-hidden="true" />
        <span className={styles.headerTitle}>ask the agent</span>
        <span className={styles.headerMeta}>openai · grounded on profile</span>
      </div>

      <div ref={messagesRef} className={styles.messages}>
        {messages.map((m, i) => {
          if (m.role === "user") {
            return (
              <div key={i} className={styles.userMsg}>
                <div className={styles.userBubble}>{m.content}</div>
              </div>
            );
          }
          const isLastAgentEmpty =
            i === messages.length - 1 && m.content === "" && showThinking;
          if (isLastAgentEmpty) {
            return (
              <div key={i} className={styles.agentMsg}>
                <div className={styles.agentAvatar} aria-hidden="true">
                  b
                </div>
                <div className={styles.generatingLine}>
                  thinking
                  <span className={styles.dot} aria-hidden="true" />
                </div>
              </div>
            );
          }
          return (
            <div key={i} className={styles.agentMsg}>
              <div className={styles.agentAvatar} aria-hidden="true">
                b
              </div>
              <div className={styles.agentText}>{m.content}</div>
            </div>
          );
        })}
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
