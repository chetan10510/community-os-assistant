import { useState } from 'react';

export function Input({
  onSend,
  disabled,
}: {
  onSend: (t: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState('');

  return (
    <input
      value={text}
      disabled={disabled}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && text.trim()) {
          onSend(text);
          setText('');
        }
      }}
      placeholder={disabled ? 'Assistant is thinking…' : 'Type a message…'}
      style={{ width: '100%', padding: 10 }}
    />
  );
}
