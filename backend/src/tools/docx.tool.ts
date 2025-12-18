import { Document, Packer, Paragraph } from 'docx';
import * as fs from 'fs';
import * as path from 'path';
import { DocumentsService } from '../documents/documents.service';

export async function createDocx(
  args: { title: string; content: string },
  documents: DocumentsService,
) {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: args.title, heading: 'Heading1' }),
          new Paragraph(args.content),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const fileName = `${args.title.replace(/\s+/g, '_')}.docx`;
  const filePath = path.join('src', 'uploads', fileName);

  fs.writeFileSync(filePath, buffer);

  return documents.create('docx', args.title, args.content, filePath);
}
