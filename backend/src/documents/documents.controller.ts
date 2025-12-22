import { Controller, Get, Param } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller('api/documents')
export class DocumentsController {
  constructor(private readonly docs: DocumentsService) {}

  @Get()
  list() {
    return this.docs.list();
  }

  @Get('active')
  active() {
    return this.docs.getActive();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.docs.getById(id);
  }
}
