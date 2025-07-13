'use client';

import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function InputArea({ onSendMessage, disabled }: InputAreaProps) {
  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    uploadedFiles,
    isProcessing,
    processFiles,
    removeFile,
    getFilesSummary,
  } = useFileUpload();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      const fullMessage = message.trim() + getFilesSummary();
      onSendMessage(fullMessage);
      setMessage('');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await processFiles(e.target.files);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickAction = (action: string) => {
    const prompts = {
      thought:
        "I'd like to do a thought check. Can you help me examine my current thoughts and identify any cognitive distortions?",
      goal: 'I want to set a meaningful goal. Can you guide me through setting a SMART goal that aligns with my values?',
      breathe:
        'I need to calm down. Can you guide me through a breathing exercise?',
    };

    const prompt = prompts[action as keyof typeof prompts];
    if (prompt && !disabled) {
      onSendMessage(prompt);
    }
  };

  return (
    <div className="glass border-t px-4 py-4 md:px-20">
      <div className="mx-auto max-w-3xl">
        {uploadedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
              >
                <span className="max-w-[150px] truncate">{file.name}</span>
                <button
                  onClick={() => removeFile(file.name)}
                  className="ml-1 hover:text-error"
                  aria-label={`Remove ${file.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {showEmoji && (
          <div className="absolute bottom-20 left-0 flex gap-2 rounded-lg bg-white p-3 shadow-lg dark:bg-gray-800">
            {['😊', '😔', '😭', '😡', '😰', '🤗', '💪', '❤️'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className="text-2xl transition-transform hover:scale-110"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="relative flex items-end gap-2 rounded-[28px] border bg-surface-light px-4 py-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20 dark:bg-black/20">
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="rounded-full p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Add emoji"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".txt,.md,.pdf"
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="rounded-full p-2 transition-colors hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/5"
            aria-label="Attach file"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your thoughts..."
            className="max-h-32 flex-1 resize-none bg-transparent py-2 text-body outline-none"
            rows={1}
            disabled={disabled}
          />

          <button
            onClick={handleSubmit}
            disabled={disabled || !message.trim()}
            className={`
              flex h-10 w-10 items-center justify-center rounded-full transition-all
              ${
                disabled || !message.trim()
                  ? 'cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-800'
                  : 'bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90 active:scale-95'
              }
            `}
            aria-label="Send message"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>

        <div className="mt-3 flex justify-center gap-2">
          <button
            onClick={() => handleQuickAction('thought')}
            className="focus-ring rounded-full border bg-white/80 px-5 py-2.5 text-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white dark:bg-black/40 dark:hover:bg-black/60"
          >
            💭 Thought Check
          </button>
          <button
            onClick={() => handleQuickAction('goal')}
            className="focus-ring rounded-full border bg-white/80 px-5 py-2.5 text-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white dark:bg-black/40 dark:hover:bg-black/60"
          >
            🎯 Set Goal
          </button>
          <button
            onClick={() => handleQuickAction('breathe')}
            className="focus-ring rounded-full border bg-white/80 px-5 py-2.5 text-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white dark:bg-black/40 dark:hover:bg-black/60"
          >
            🌊 Breathe
          </button>
        </div>
      </div>
    </div>
  );
}
