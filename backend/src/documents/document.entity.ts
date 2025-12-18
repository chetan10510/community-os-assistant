export type DocumentType = 'docx' | 'excel';

export type DocumentEntity = {
  id: string;
  type: DocumentType;
  name: string;
  content: string;
  filePath: string;
  createdAt: Date;
  updatedAt: Date;
};
