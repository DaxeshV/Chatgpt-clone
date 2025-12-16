export function normalizeError(err: unknown, fallbackMessage: string): string {
  if (!err) return fallbackMessage;

  if (err instanceof Error && err.message) {
    return err.message;
  }

  if (typeof err === 'string') {
    return err;
  }

  try {
    const asAny = err as any;
    if (asAny?.message && typeof asAny.message === 'string') {
      return asAny.message;
    }
  } catch {
    // ignore
  }

  return fallbackMessage;
}


