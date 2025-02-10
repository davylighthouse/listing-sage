
import { Session } from "@supabase/supabase-js";

export function useAuth() {
  // Mock a constant session for development
  const mockSession: Session = {
    access_token: "mock_token",
    token_type: "bearer",
    expires_in: 3600,
    refresh_token: "mock_refresh",
    user: {
      id: "d4f32e54-1234-4321-8765-1a2b3c4d5e6f", // Valid UUID format
      aud: "authenticated",
      role: "authenticated",
      email: "dev@example.com",
      email_confirmed_at: new Date().toISOString(),
      phone: "",
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {
        provider: "email",
        providers: ["email"],
      },
      user_metadata: {},
      identities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    expires_at: Date.now() + 3600000,
  };

  return {
    session: mockSession,
    loading: false,
    user: mockSession.user,
  };
}
