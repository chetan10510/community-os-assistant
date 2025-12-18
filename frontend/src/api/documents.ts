export async function fetchActiveDocument() {
  const res = await fetch('http://localhost:3001/api/documents/active');
  if (!res.ok) return null;
  return res.json();
}
