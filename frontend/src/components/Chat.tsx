import { useState } from 'react';
import { streamMessage } from '../api/chat';
import { Message } from './Message';
import { Input } from './Input';

type Msg = { role: 'user' | 'assistant'; content: string };

export function Chat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  async function handleSend(text: string) {
    if (!text.trim() || isStreaming) return;

    const nextMessages: Msg[] = [
      ...messages,
      { role: 'user', content: text },
    ];
    setMessages(nextMessages);

    // placeholder assistant message for streaming
    const assistant: Msg = { role: 'assistant', content: '' };
    setMessages([...nextMessages, assistant]);
    setIsStreaming(true);

    await streamMessage(
      nextMessages,
      (token) => {
        assistant.content += token;
        setMessages([...nextMessages, { ...assistant }]);
      },
      () => setIsStreaming(false),
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <h2>Community OS Assistant</h2>

      <div
        style={{
          minHeight: 400,
          border: '1px solid #ddd',
          padding: 12,
          marginBottom: 12,
          overflowY: 'auto',
        }}
      >
        {messages.map((m, i) => (
          <Message key={i} role={m.role} content={m.content} />
        ))}
      </div>

      <Input onSend={handleSend} disabled={isStreaming} />
    </div>
  );
}
