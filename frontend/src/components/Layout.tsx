import { ReactNode } from 'react';

export function Layout({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '50%',
          borderRight: '1px solid #ddd',
          overflowY: 'auto',
        }}
      >
        {left}
      </div>

      <div
        style={{
          width: '50%',
          background: '#fafafa',
          overflowY: 'auto',
        }}
      >
        {right}
      </div>
    </div>
  );
}
