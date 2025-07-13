import { Message, Session } from '@/types/chat';

interface SessionData {
  sessions: Map<string, Session>;
  currentSessionId: string | null;
}

class SessionManager {
  private storageKey = 'ai-therapy-sessions';
  private data: SessionData;

  constructor() {
    this.data = this.loadFromStorage();
  }

  private loadFromStorage(): SessionData {
    if (typeof window === 'undefined') {
      return { sessions: new Map(), currentSessionId: null };
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const sessions = new Map<string, Session>();

        Object.entries(parsed.sessions).forEach(([id, sessionData]) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const session = sessionData as any;
          sessions.set(id, {
            id: session.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            messages: session.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
            createdAt: new Date(session.createdAt),
            lastActive: new Date(session.lastActive),
            topics: session.topics || [],
            mood: session.mood,
          });
        });

        return {
          sessions,
          currentSessionId: parsed.currentSessionId,
        };
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }

    return { sessions: new Map(), currentSessionId: null };
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const toStore = {
        sessions: Object.fromEntries(this.data.sessions),
        currentSessionId: this.data.currentSessionId,
      };
      localStorage.setItem(this.storageKey, JSON.stringify(toStore));
    } catch (error) {
      console.error('Failed to save sessions:', error);
    }
  }

  createSession(): string {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const session: Session = {
      id: sessionId,
      messages: [],
      createdAt: new Date(),
      lastActive: new Date(),
      topics: [],
    };

    this.data.sessions.set(sessionId, session);
    this.data.currentSessionId = sessionId;
    this.saveToStorage();

    return sessionId;
  }

  getCurrentSession(): Session | null {
    if (!this.data.currentSessionId) return null;
    return this.data.sessions.get(this.data.currentSessionId) || null;
  }

  getSession(sessionId: string): Session | null {
    return this.data.sessions.get(sessionId) || null;
  }

  getAllSessions(): Session[] {
    return Array.from(this.data.sessions.values()).sort(
      (a, b) => b.lastActive.getTime() - a.lastActive.getTime()
    );
  }

  addMessage(sessionId: string, message: Message): void {
    const session = this.data.sessions.get(sessionId);
    if (!session) return;

    session.messages.push(message);
    session.lastActive = new Date();

    if (message.metadata?.topics) {
      session.topics = [
        ...new Set([...session.topics, ...message.metadata.topics]),
      ];
    }

    this.saveToStorage();
  }

  updateSessionTopics(sessionId: string, topics: string[]): void {
    const session = this.data.sessions.get(sessionId);
    if (!session) return;

    session.topics = [...new Set([...session.topics, ...topics])];
    this.saveToStorage();
  }

  setCurrentSession(sessionId: string): void {
    if (this.data.sessions.has(sessionId)) {
      this.data.currentSessionId = sessionId;
      this.saveToStorage();
    }
  }

  deleteSession(sessionId: string): void {
    this.data.sessions.delete(sessionId);
    if (this.data.currentSessionId === sessionId) {
      this.data.currentSessionId = null;
    }
    this.saveToStorage();
  }

  clearAllSessions(): void {
    this.data.sessions.clear();
    this.data.currentSessionId = null;
    this.saveToStorage();
  }

  getSessionMetrics(): {
    totalSessions: number;
    totalMessages: number;
    avgMessagesPerSession: number;
    topTopics: { topic: string; count: number }[];
  } {
    const sessions = this.getAllSessions();
    const totalMessages = sessions.reduce(
      (sum, s) => sum + s.messages.length,
      0
    );

    const topicCounts = new Map<string, number>();
    sessions.forEach((session) => {
      session.topics.forEach((topic) => {
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
      });
    });

    const topTopics = Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));

    return {
      totalSessions: sessions.length,
      totalMessages,
      avgMessagesPerSession:
        sessions.length > 0 ? totalMessages / sessions.length : 0,
      topTopics,
    };
  }
}

export const sessionManager = new SessionManager();
