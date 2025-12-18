import { useState } from 'react';
import { Layout } from '../components/Layout';
import { ChatPane } from '../components/ChatPane';
import { DocPane } from '../components/DocPane';

export function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Layout
      left={
        <ChatPane
          onDocumentChange={() => setRefreshKey((k) => k + 1)}
        />
      }
      right={<DocPane refreshKey={refreshKey} />}
    />
  );
}
