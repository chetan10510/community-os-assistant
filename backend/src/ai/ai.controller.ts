import {
  Controller,
  Post,
  Body,
  Headers,
} from '@nestjs/common';
import { AiService } from './ai.service';
import {
  getState,
  setState,
  resetState,
} from './conversation.state';
import { executeToolCall } from '../tools/tool-executor';
import type { ChatCompletionMessageToolCall } from 'openai/resources/chat/completions';

@Controller('api/chat')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post()
  async chat(
    @Body() body: any,
    @Headers('x-session-id') sessionId = 'default',
  ) {
    const state = getState(sessionId);
    const userMessage = body.messages.at(-1)?.content?.toLowerCase() || '';

    // STEP 1: Detect intent
    if (state.step === 'idle') {
      if (userMessage.includes('document') || userMessage.includes('excel')) {
        setState(sessionId, { step: 'ask_type' });
        return { role: 'assistant', content: 'Do you want to create a Word document or an Excel file?' };
      }
    }

    // STEP 2: Ask type
    if (state.step === 'ask_type') {
      if (userMessage.includes('word')) {
        setState(sessionId, { ...state, step: 'ask_name', docType: 'docx' });
        return { role: 'assistant', content: 'What should be the document name?' };
      }
      if (userMessage.includes('excel')) {
        setState(sessionId, { ...state, step: 'ask_name', docType: 'excel' });
        return { role: 'assistant', content: 'What should be the spreadsheet name?' };
      }
      return { role: 'assistant', content: 'Please choose either Word document or Excel.' };
    }

    // STEP 3: Ask name
    if (state.step === 'ask_name') {
      setState(sessionId, { ...state, step: 'ask_content', docName: body.messages.at(-1).content });
      return { role: 'assistant', content: 'What content should it contain?' };
    }

    // STEP 4: Ask content
    if (state.step === 'ask_content') {
      setState(sessionId, { ...state, step: 'confirm', content: body.messages.at(-1).content });
      return {
        role: 'assistant',
        content: `I am about to create a ${state.docType === 'docx' ? 'Word document' : 'Excel file'} named "${state.docName}". Shall I proceed?`,
      };
    }

    // STEP 5: Confirmation
    if (state.step === 'confirm') {
      if (userMessage.includes('yes')) {
        const toolName = state.docType === 'docx' ? 'create_docx' : 'create_excel';

        const toolCall: ChatCompletionMessageToolCall = {
          id: 'tool',
          type: 'function',
          function: {
            name: toolName,
            arguments: JSON.stringify({
              title: state.docName,
              content: state.content,
              sheetName: state.docName,
              rows: [[state.content]],
            }),
          },
        };

        resetState(sessionId);
        const result = await executeToolCall(toolCall.function);
        return { role: 'assistant', content: 'Document created successfully.', toolResult: result };
      }

      resetState(sessionId);
      return { role: 'assistant', content: 'Okay, cancelled.' };
    }

    // FALLBACK → normal AI chat
    return this.ai.chat(body.messages);
  }
}
