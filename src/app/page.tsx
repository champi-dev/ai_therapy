'use client';

import Navigation from '@/components/Navigation';
import ChatArea from '@/components/ChatArea';
import InputArea from '@/components/InputArea';
import TherapistPresence from '@/components/TherapistPresence';
import PWAInstallButton from '@/components/PWAInstallButton';
import { useStreamingChat } from '@/hooks/useStreamingChat';

export default function Home() {
  const { messages, isStreaming, sendMessage } = useStreamingChat({
    enableWebSearch: process.env.NEXT_PUBLIC_ENABLE_WEB_SEARCH === 'true',
    enableFactCheck: process.env.NEXT_PUBLIC_ENABLE_FACT_CHECK === 'true',
  });

  return (
    <div className="flex h-screen flex-col">
      <Navigation />
      <PWAInstallButton />

      <main className="relative flex-1 overflow-hidden">
        {messages.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <TherapistPresence />
          </div>
        )}

        <ChatArea messages={messages} isLoading={isStreaming} />
      </main>

      <InputArea onSendMessage={sendMessage} disabled={isStreaming} />
    </div>
  );
}
