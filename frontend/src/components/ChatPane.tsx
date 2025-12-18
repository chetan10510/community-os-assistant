import { useState } from 'react';
import { Message as MsgType, streamChat } from '../api/chat';
import { Message } from './Message';
import { Input } from './Input';

export function ChatPane({ onDocumentChange }: { onDocumentChange: () => void }) {
  const [messages, setMessages] = useState<MsgType[]>([]);
  const [streaming, setStreaming] = useState(false);

  async function send(text: string) {
    if (!text || streaming) return;

    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);

    const assistant = { role: 'assistant' as const, content: '' };
    setMessages([...next, assistant]);
    setStreaming(true);

    await streamChat(
      next,
      (token) => {
        assistant.content += token;
        setMessages([...next, { ...assistant }]);
      },
      () => {
        setStreaming(false);
        onDocumentChange(); // refresh doc pane
      },
    );
  }

  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3>Community OS Assistant</h3>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <Message key={i} {...m} />
        ))}
      </div>

      <Input onSend={send} disabled={streaming} />
    </div>
  );
}
