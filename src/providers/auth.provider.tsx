// stores/useAuth.ts
import { API_URL } from "@/constants";
import type { User } from "@/types";
// import { useEffect } from "react";
import { create } from "zustand";

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  refresh: (token: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  isLoading: true,

  refresh: async (token: string) => {
    localStorage.setItem("token", token);
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (!res.ok) {
      localStorage.removeItem("token");
      set({ user: null, token: null, isLoading: false });
      return;
    }

    const user = await res.json();
    set({ user, token, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  setUser: (user) => set({ user }),
}));
