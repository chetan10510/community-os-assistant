import { Controller, Get } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller('api/documents')
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  @Get('active')
  getActive() {
    return this.documents.getActive();
  }

  @Get()
  list() {
    return this.documents.list();
  }
}
