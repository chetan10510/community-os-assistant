import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { getSystemPrompt } from './system-prompt';
import { tools } from './tools.definition';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async chat(messages: ChatCompletionMessageParam[]) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: getSystemPrompt() },
        ...messages,
      ],
      tools,
      tool_choice: 'auto',
    });

    return response.choices[0].message;
  }
}
