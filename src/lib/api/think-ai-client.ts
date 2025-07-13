import { Message, Source, FactCheck } from '@/types/chat';

interface ThinkAIResponse {
  response: string;
  session_id: string;
  message_id: string;
  metadata: {
    response_time_ms: number;
    source: string;
    optimization_level: string;
    web_search_used: boolean;
  };
  sources?: Source[];
  fact_check?: FactCheck;
  context_info: {
    total_messages: number;
    session_age_minutes: number;
    topics: string[];
    memory_usage_kb: number;
  };
}

interface MessageCache {
  [key: string]: ThinkAIResponse;
}

class ThinkAIClient {
  private baseUrl: string;
  private cache: MessageCache = {};
  private cacheSize = 100;
  private sessionMap: Map<string, string> = new Map();

  constructor(
    baseUrl: string = process.env.NEXT_PUBLIC_THINK_AI_API_URL ||
      'https://thinkai.lat/api'
  ) {
    this.baseUrl = baseUrl;
  }

  private getCacheKey(message: string, sessionId?: string): string {
    return `${sessionId || 'anon'}:${message}`;
  }

  private addToCache(key: string, response: ThinkAIResponse): void {
    const keys = Object.keys(this.cache);
    if (keys.length >= this.cacheSize) {
      delete this.cache[keys[0]];
    }
    this.cache[key] = response;
  }

  async sendMessage(
    message: string,
    sessionId?: string | null,
    options: {
      useWebSearch?: boolean;
      factCheck?: boolean;
      systemPrompt?: string;
    } = {}
  ): Promise<ThinkAIResponse> {
    const cacheKey = this.getCacheKey(message, sessionId || undefined);

    if (this.cache[cacheKey]) {
      return {
        ...this.cache[cacheKey],
        metadata: {
          ...this.cache[cacheKey].metadata,
          response_time_ms: 0,
          source: 'cache',
        },
      };
    }

    const startTime = performance.now();

    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: options.systemPrompt
            ? `${options.systemPrompt}\n\n${message}`
            : message,
          session_id: sessionId,
          use_web_search: options.useWebSearch ?? true,
          fact_check: options.factCheck ?? true,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: ThinkAIResponse = await response.json();

      data.metadata.response_time_ms = performance.now() - startTime;

      this.addToCache(cacheKey, data);

      if (data.session_id && sessionId) {
        this.sessionMap.set(sessionId, data.session_id);
      }

      return data;
    } catch (error) {
      console.error('ThinkAI API error:', error);
      throw error;
    }
  }

  async streamMessage(
    message: string,
    onChunk: (chunk: string) => void,
    sessionId?: string | null,
    systemPrompt?: string
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: systemPrompt ? `${systemPrompt}\n\n${message}` : message,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Stream API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (!data.done && data.chunk) {
              onChunk(data.chunk);
            }
          } catch (e) {
            console.error('Failed to parse SSE data:', e);
          }
        }
      }
    }
  }

  async getHistory(sessionId: string): Promise<Message[]> {
    const response = await fetch(`${this.baseUrl}/history/${sessionId}`);

    if (!response.ok) {
      throw new Error(`History API error: ${response.status}`);
    }

    const data = await response.json();

    return data.messages.map(
      (msg: {
        id: string;
        role: string;
        content: string;
        timestamp: string;
      }) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
      })
    );
  }

  clearCache(): void {
    this.cache = {};
  }
}

export const thinkAI = new ThinkAIClient();
