import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  token: null,

  setUser: (user) => set({ user, isLoggedIn: !!user }),
  setToken: (token) => set({ token }),

  logout: async () => {
    try {
      // Dynamically import to avoid bundling server code on the client
      const { logoutServerFn } = await import("@/lib/auth.functions");
      await logoutServerFn();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      set({ user: null, isLoggedIn: false, token: null });
    }
  },

  restoreSession: async () => {
    set({ isLoading: true });
    try {
      const { checkAuthFn } = await import("@/lib/auth.functions");
      const { user } = await checkAuthFn();
      if (user) {
        set({
          user: {
            id: user.id,
            name: user.user_metadata?.full_name ?? user.email ?? "",
            email: user.email ?? "",
            phone: user.phone ?? null,
            avatar: user.user_metadata?.avatar_url ?? null,
            createdAt: user.created_at,
          },
          isLoggedIn: true,
        });
      } else {
        set({ user: null, isLoggedIn: false });
      }
    } catch {
      set({ user: null, isLoggedIn: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
