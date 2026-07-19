import { useState, useCallback, useRef } from "react";

export interface AgentMessage {
  role: "user" | "assistant";
  content: string;
}

export function useAgent() {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(async (userInput: string) => {
    setIsLoading(true);
    const newMessages: AgentMessage[] = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: abort.signal,
      });

      if (!res.ok) {
        throw new Error(`Agent error: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantContent += decoder.decode(value, { stream: true });
        setMessages([...newMessages, { role: "assistant", content: assistantContent }]);
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setMessages([...newMessages, { role: "assistant", content: `Error: ${(err as Error).message}` }]);
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [messages]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clear = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, send, cancel, clear };
}
