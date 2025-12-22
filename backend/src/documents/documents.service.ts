import { Injectable } from '@nestjs/common';
import { DocumentEntity, DocumentType } from './documents.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class DocumentsService {
  private documents = new Map<string, DocumentEntity>();
  private activeDocumentId: string | null = null;

  create(
    type: DocumentType,
    name: string,
    content: string,
    filePath: string,
  ) {
    const now = new Date();

    const doc: DocumentEntity = {
      id: randomUUID(),
      type,
      name,
      content,
      filePath,
      createdAt: now,
      updatedAt: now,
    };

    this.documents.set(doc.id, doc);
    this.activeDocumentId = doc.id;
    return doc;
  }

  update(id: string, content: string, filePath: string) {
    const doc = this.documents.get(id);
    if (!doc) throw new Error('Document not found');

    doc.content = content;
    doc.filePath = filePath;
    doc.updatedAt = new Date();

    return doc;
  }

  getActive() {
    if (!this.activeDocumentId) return null;
    return this.documents.get(this.activeDocumentId) || null;
  }

  list() {
    return Array.from(this.documents.values());
  }

  clearActive() {
    this.activeDocumentId = null;
  }
    getById(id: string) {
    return this.documents.get(id) || null;
  }

  setActive(id: string) {
    if (this.documents.has(id)) {
      this.activeDocumentId = id;
    }
  }

}
