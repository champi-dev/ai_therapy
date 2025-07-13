import { useState, useCallback, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import { thinkAI } from '@/lib/api/think-ai-client';
import { sessionManager } from '@/lib/session-manager';
import { enhanceMessageWithTherapeuticContext } from '@/lib/therapy-prompt';

interface UseStreamingChatOptions {
  onMessageComplete?: (message: Message) => void;
  enableWebSearch?: boolean;
  enableFactCheck?: boolean;
}

export function useStreamingChat(options: UseStreamingChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const streamingMessageId = useRef<string | null>(null);
  const streamingContentRef = useRef<string>('');

  useEffect(() => {
    const currentSession = sessionManager.getCurrentSession();
    if (currentSession) {
      setMessages(currentSession.messages);
      setSessionId(currentSession.id);
    } else {
      const newSessionId = sessionManager.createSession();
      setSessionId(newSessionId);
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      if (sessionId) {
        sessionManager.addMessage(sessionId, userMessage);
      }
      setIsStreaming(true);
      streamingContentRef.current = '';
      streamingMessageId.current = Date.now().toString();

      try {
        const useStreaming = true;

        if (useStreaming) {
          const tempMessage: Message = {
            id: streamingMessageId.current,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, tempMessage]);

          const session = sessionId
            ? sessionManager.getSession(sessionId)
            : null;
          const sessionContext = {
            previousMessages:
              session?.messages.map((m) => ({
                role: m.role,
                content: m.content,
              })) || [],
            mood: session?.mood?.label,
            topics: session?.topics,
          };

          const enhancedMessage = enhanceMessageWithTherapeuticContext(
            content,
            sessionContext
          );

          await thinkAI.streamMessage(
            content,
            (chunk) => {
              streamingContentRef.current += chunk;
              setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                  msg.id === streamingMessageId.current
                    ? { ...msg, content: msg.content + chunk }
                    : msg
                )
              );
            },
            sessionId,
            enhancedMessage.replace(content, '').trim()
          );

          const finalMessage = {
            ...tempMessage,
            content: streamingContentRef.current,
          };

          if (options.onMessageComplete) {
            options.onMessageComplete(finalMessage);
          }
        } else {
          const session = sessionId
            ? sessionManager.getSession(sessionId)
            : null;
          const sessionContext = {
            previousMessages:
              session?.messages.map((m) => ({
                role: m.role,
                content: m.content,
              })) || [],
            mood: session?.mood?.label,
            topics: session?.topics,
          };

          const enhancedMessage = enhanceMessageWithTherapeuticContext(
            content,
            sessionContext
          );

          const data = await thinkAI.sendMessage(content, sessionId, {
            useWebSearch: options.enableWebSearch,
            factCheck: options.enableFactCheck,
            systemPrompt: enhancedMessage.replace(content, '').trim(),
          });

          const aiMessage: Message = {
            id: data.message_id,
            role: 'assistant',
            content: data.response,
            timestamp: new Date(),
            metadata: data.metadata,
            sources: data.sources,
            factCheck: data.fact_check,
          };

          setMessages((prev) => [...prev, aiMessage]);
          if (data.session_id) setSessionId(data.session_id);
          if (sessionId) {
            sessionManager.addMessage(sessionId, aiMessage);
          }

          if (options.onMessageComplete) {
            options.onMessageComplete(aiMessage);
          }
        }
      } catch (error) {
        console.error('Chat error:', error);
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'system',
          content: 'I apologize, but I encountered an error. Please try again.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsStreaming(false);
        streamingContentRef.current = '';
        streamingMessageId.current = null;
      }
    },
    [sessionId, options]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setSessionId(null);
  }, []);

  return {
    messages,
    isStreaming,
    sendMessage,
    clearMessages,
    sessionId,
  };
}
