export default function TypingIndicator() {
  return (
    <div data-testid="typing-indicator" role="status" aria-label="AI therapist is typing" className="flex justify-start">
      <div className="rounded-[20px] rounded-bl-[4px] border bg-canvas-light px-5 py-3 shadow-sm dark:bg-canvas-dark">
        <span className="sr-only">AI therapist is typing...</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              data-testid={`typing-dot-${i + 1}`}
              className="h-2 w-2 rounded-full bg-text-secondary-light dark:bg-text-secondary-dark"
              style={{
                animation: `wave 1.2s linear infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
