'use client';

import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import TherapistPresence from './TherapistPresence';
import { Message } from '@/types/chat';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatArea({ messages, isLoading }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <main
      role="main"
      className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20 px-4 py-8 md:px-20"
    >
      <div className="mx-auto max-w-3xl space-y-4">
        {messages.length > 0 && messages.some(m => m.role === 'assistant') && (
          <TherapistPresence />
        )}
        
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>
    </main>
  );
}
