export type DocumentRecord = {
  title: string;
  content: string;
  fileName: string;
};

export const documentStore = new Map<string, DocumentRecord>();

// we keep it simple: one active document per session
export const LAST_DOCUMENT_KEY = 'last';
