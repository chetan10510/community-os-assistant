import ExcelJS from 'exceljs';
import * as path from 'path';
import { DocumentsService } from '../documents/documents.service';

export async function createExcel(
  args: { sheetName: string; rows: string[][] },
  documents: DocumentsService,
) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(args.sheetName);

  args.rows.forEach((row) => sheet.addRow(row));

  const fileName = `${args.sheetName.replace(/\s+/g, '_')}.xlsx`;
  const filePath = path.join('src', 'uploads', fileName);

  await workbook.xlsx.writeFile(filePath);

  return documents.create(
    'excel',
    args.sheetName,
    JSON.stringify(args.rows, null, 2),
    filePath,
  );
}
