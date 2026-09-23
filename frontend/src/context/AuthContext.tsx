"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        if (typeof window !== "undefined") {
          const previousUserId = localStorage.getItem("user_id");
          if (previousUserId && previousUserId !== String(data.id)) {
            // Clear old user's active career and progress
            const keysToRemove = Object.keys(localStorage).filter(
              k => k.startsWith("progress_") || k.startsWith("roadmap_data_") || k === "active_career"
            );
            keysToRemove.forEach(k => localStorage.removeItem(k));
          }
          localStorage.setItem("user_id", String(data.id));
          localStorage.setItem("user_name", data.name);
          localStorage.setItem("user_email", data.email);
        }
      } else {
        if (typeof window !== "undefined") {
          const keysToRemove = Object.keys(localStorage).filter(
            k => k.startsWith("progress_") || k.startsWith("roadmap_data_") || k.startsWith("user_") || k === "active_career" || k === "token"
          );
          keysToRemove.forEach(k => localStorage.removeItem(k));
        }
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const refreshUser = async () => {
    await fetchUser();
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      const keysToRemove = Object.keys(localStorage).filter(
        k => k.startsWith("progress_") || k.startsWith("roadmap_data_") || k.startsWith("user_") || k === "active_career" || k === "token"
      );
      keysToRemove.forEach(k => localStorage.removeItem(k));
    }
    setUser(null);
    router.push("/auth?mode=login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
