/**
 * Environment detection for adaptive behavior
 */
export const isServerless =
  process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

/**
 * Adaptive timeout utility
 * - Serverless: 15s (fast fail, enable fallback)
 * - Dev: 60s (allow slow models, better DX)
 */
export function withTimeout<T>(
  promise: Promise<T>,
  customTimeout?: number
): Promise<T> {
  const timeout = customTimeout ?? (isServerless ? 15000 : 60000);

  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("LLM_TIMEOUT")), timeout)
    ),
  ]);
}
