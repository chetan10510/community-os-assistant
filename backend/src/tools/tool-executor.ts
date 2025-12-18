import { createDocx } from './docx.tool';
import { createExcel } from './excel.tool';
import { DocumentsService } from '../documents/documents.service';

let documentsService: DocumentsService | null = null;

export function registerDocumentsService(service: DocumentsService) {
  documentsService = service;
}

export async function executeToolCall(call: {
  name: string;
  arguments: string;
}) {
  if (!documentsService) {
    throw new Error('DocumentsService not registered');
  }

  const args =
    typeof call.arguments === 'string'
      ? JSON.parse(call.arguments)
      : call.arguments;

  switch (call.name) {
    case 'create_docx':
      return createDocx(
        { title: args.title, content: args.content },
        documentsService,
      );

    case 'create_excel':
      return createExcel(
        { sheetName: args.sheetName, rows: args.rows },
        documentsService,
      );

    case 'update_active_doc': {
      const active = documentsService.getActive();
      if (!active) throw new Error('No active document');

      const newContent = active.content + '\n\n' + args.additionalContent;
      return createDocx(
        { title: active.name, content: newContent },
        documentsService,
      );
    }

    default:
      throw new Error(`Unknown tool: ${call.name}`);
  }
}
