/**
 * Wraps a promise with a timeout. If the promise doesn't resolve within
 * the specified duration, the returned promise rejects with a timeout error.
 *
 * Use this around ALL Firestore calls to prevent indefinite hanging when
 * the Firestore connection stalls (no offline persistence = `getDocs`/`addDoc`
 * wait forever for server response).
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number = 10000,
): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), ms),
  );
  return Promise.race([promise, timeout]);
}
