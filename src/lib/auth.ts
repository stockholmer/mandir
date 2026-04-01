import { createClient } from "@/lib/supabase/client";
import type { AuthError } from "@supabase/supabase-js";

type AuthResult =
  | { success: true }
  | { success: false; error: string };

export async function adminLogin(
  email: string,
  password: string
): Promise<AuthResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function adminLogout(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function resetPassword(email: string): Promise<AuthResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/admin/reset-password`,
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export function getAuthErrorMessage(error: AuthError): string {
  switch (error.message) {
    case "Invalid login credentials":
      return "Invalid email or password.";
    case "Email not confirmed":
      return "Please confirm your email address.";
    default:
      return error.message;
  }
}
