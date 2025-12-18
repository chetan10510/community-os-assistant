import type { ChatCompletionTool } from 'openai/resources/chat/completions';

export const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'create_docx',
      description: 'Create a Word document with a title and content',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          content: { type: 'string' },
        },
        required: ['title', 'content'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_last_doc',
      description:
        'Append new content to the previously created Word document',
      parameters: {
        type: 'object',
        properties: {
          additionalContent: { type: 'string' },
        },
        required: ['additionalContent'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_excel',
      description: 'Create an Excel file from rows of data',
      parameters: {
        type: 'object',
        properties: {
          sheetName: { type: 'string' },
          rows: {
            type: 'array',
            items: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
        required: ['sheetName', 'rows'],
      },
    },
  },
];
