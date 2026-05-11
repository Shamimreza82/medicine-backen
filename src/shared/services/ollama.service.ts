import axios from 'axios';

import { envConfig } from '@/config/env.config';
import { AppError } from '@/shared/errors/AppError';


interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OllamaChatResponse {
  message?: {
    content?: string;
  };
}

interface OllamaEmbeddingResponse {
  embedding?: number[];
}

const ollamaClient = axios.create({
  baseURL: envConfig.ollamaBaseUrl,
  timeout: 60_000,
});



export const OllamaService = {
  async embedText(text: string) {
    const response = await ollamaClient.post<OllamaEmbeddingResponse>('/api/embeddings', {
      model: envConfig.ollamaEmbeddingModel,
      prompt: text,
    });

    const embedding = response.data.embedding;

    if (!embedding || embedding.length === 0) {
      throw new AppError(502, 'Ollama embedding response was empty');
    }

    return embedding;
  },

  async chat(messages: OllamaChatMessage[]) {
    const response = await ollamaClient.post<OllamaChatResponse>('/api/chat', {
      model: envConfig.ollamaChatModel,
      stream: false,
      messages,
    });

    const content = response.data.message?.content?.trim();

    if (!content) {
      throw new AppError(502, 'Ollama chat response was empty');
    }

    return content;
  },
};
