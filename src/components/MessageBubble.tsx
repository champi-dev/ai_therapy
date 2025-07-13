'use client';

import { Message } from '@/types/chat';
import { formatRelativeTime } from '@/utils/time';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in`}
    >
      <div
        className={`
          max-w-[70%] rounded-[20px] px-5 py-3 shadow-sm
          ${
            isUser
              ? 'rounded-br-[4px] bg-primary text-white'
              : 'rounded-bl-[4px] border bg-canvas-light dark:bg-canvas-dark'
          }
        `}
      >
        <p className="whitespace-pre-wrap text-body">{message.content}</p>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 space-y-2 border-t border-white/20 pt-3">
            <p className="mb-2 text-sm font-medium">Sources:</p>
            {message.sources.map((source, index) => (
              <div key={index} className="text-sm opacity-90">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  {source.title}
                </a>
                <span className="opacity-75"> - {source.citation}</span>
              </div>
            ))}
          </div>
        )}

        <div
          className={`mt-2 text-micro ${isUser ? 'text-white/70' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}
        >
          {formatRelativeTime(message.timestamp)}
          {message.metadata?.response_time_ms && (
            <span className="ml-2">
              • {message.metadata.response_time_ms}ms
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
