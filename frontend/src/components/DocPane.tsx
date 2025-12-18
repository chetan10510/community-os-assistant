import { useEffect, useState } from 'react';
import { fetchActiveDocument } from '../api/documents';

export function DocPane({ refreshKey }: { refreshKey: number }) {
  const [doc, setDoc] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveDocument()
      .then(setDoc)
      .catch(() => setError('Failed to load document'));
  }, [refreshKey]);

  if (error) {
    return <div style={{ padding: 20 }}>{error}</div>;
  }

  if (!doc) {
    return <div style={{ padding: 20 }}>No document yet.</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>{doc.name}</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{doc.content}</pre>

      <a
        href={`http://localhost:3001/${doc.filePath}`}
        target="_blank"
        rel="noreferrer"
      >
        Download file
      </a>
    </div>
  );
}
