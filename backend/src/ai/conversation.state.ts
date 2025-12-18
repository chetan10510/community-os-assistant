export type DocType = 'docx' | 'excel';

export type ConversationState = {
  step:
    | 'idle'
    | 'ask_type'
    | 'ask_name'
    | 'ask_content'
    | 'confirm';

  docType?: DocType;
  docName?: string;
  content?: string;
};

export const conversationStore = new Map<string, ConversationState>();

export function getState(sessionId: string): ConversationState {
  return (
    conversationStore.get(sessionId) || { step: 'idle' }
  );
}

export function setState(sessionId: string, state: ConversationState) {
  conversationStore.set(sessionId, state);
}

export function resetState(sessionId: string) {
  conversationStore.delete(sessionId);
}
