export default function Offline() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary opacity-80" />
      </div>

      <h1 className="mb-4 text-h1 font-medium">You&apos;re Offline</h1>
      <p className="mb-8 max-w-md text-body text-text-secondary-light dark:text-text-secondary-dark">
        AI Therapy requires an internet connection to provide therapeutic
        support. Please check your connection and try again.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="focus-ring rounded-full bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90"
      >
        Try Again
      </button>
    </div>
  );
}
