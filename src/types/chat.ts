export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    response_time_ms?: number;
    source?: string;
    optimization_level?: string;
    web_search_used?: boolean;
    topics?: string[];
  };
  sources?: Source[];
  factCheck?: FactCheck;
}

export interface Source {
  title: string;
  url: string;
  snippet: string;
  credibility_score: number;
  citation: string;
}

export interface FactCheck {
  verdict: string;
  confidence: number;
  explanation: string;
}

export interface Session {
  id: string;
  messages: Message[];
  createdAt: Date;
  lastActive: Date;
  topics: string[];
  mood?: MoodState;
}

export interface MoodState {
  emoji: string;
  label: string;
  score: number;
}

export type EmotionalTone = 'calm' | 'energized' | 'balanced' | 'neutral';
