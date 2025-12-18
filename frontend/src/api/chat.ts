export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export async function sendChat(messages: Message[]) {
  const res = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) throw new Error('Chat failed');
  return res.json();
}

export async function streamChat(
  messages: Message[],
  onToken: (t: string) => void,
  onDone: () => void,
) {
  const res = await fetch('http://localhost:3001/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  if (!res.body) return;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';

    for (const part of parts) {
      if (!part.startsWith('data:')) continue;
      const data = part.replace('data:', '').trim();
      if (data === '[DONE]') {
        onDone();
        return;
      }
      onToken(data);
    }
  }
}
