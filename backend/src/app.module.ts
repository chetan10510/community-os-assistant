import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './ai/ai.module';
import { DocumentsModule } from './documents/documents.module';
import { DocumentsService } from './documents/documents.service';
import { registerDocumentsService } from './tools/tool-executor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DocumentsModule,
    AiModule,
  ],
})
export class AppModule {
  constructor(documentsService: DocumentsService) {
    registerDocumentsService(documentsService);
  }
}
