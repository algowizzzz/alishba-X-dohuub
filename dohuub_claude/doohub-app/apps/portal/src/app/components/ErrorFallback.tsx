interface Props {
  error: unknown;
  resetError: () => void;
}

export function ErrorFallback({ error, resetError }: Props) {
  const message = error instanceof Error ? error.message : 'Unexpected error';
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl">
          !
        </div>
        <h1 className="mb-2 text-lg font-semibold text-neutral-900">Something went wrong</h1>
        <p className="mb-6 text-sm text-neutral-600">
          We hit an unexpected error and our team has been notified. You can try again, or head
          back to the home page.
        </p>
        <p className="mb-6 break-words rounded-md bg-neutral-100 p-3 text-left font-mono text-xs text-neutral-500">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={resetError}
            className="flex-1 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}
