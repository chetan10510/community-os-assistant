export function Message({ role, content }: { role: string; content: string }) {
  return (
    <div style={{ margin: '10px 0' }}>
      <strong>{role === 'user' ? 'You' : 'Assistant'}:</strong>
      <div>{content}</div>
    </div>
  );
}
