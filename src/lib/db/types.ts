/**
 * Standard result type for all database operations.
 * Used by all service modules for consistent error handling.
 */
export type ServiceResult =
  | { success: true; id: string }
  | { success: false; error: string };

/**
 * Standard result type for query operations that return data.
 */
export type QueryResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
