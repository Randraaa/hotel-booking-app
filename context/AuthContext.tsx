"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Safe client-side session lookup on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("luxe-session");
      if (stored) {
        const parsed = JSON.parse(stored);
        setTimeout(() => {
          setUser(parsed);
          setIsAuthenticated(true);
          setIsLoading(false);
        }, 0);
      } else {
        setTimeout(() => {
          setIsLoading(false);
        }, 0);
      }
    } catch (err) {
      console.error("Session lookup error:", err);
      setTimeout(() => {
        setIsLoading(false);
      }, 0);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    let loggedUser: User;
    
    if (email === "guest@hotelluxe.com" && password === "password123") {
      loggedUser = {
        name: "Alex Vance",
        email: "guest@hotelluxe.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      };
    } else {
      // Allow any credentials to log in, creating a default username
      const username = email.split("@")[0];
      loggedUser = {
        name: username.charAt(0).toUpperCase() + username.slice(1),
        email,
      };
    }

    localStorage.setItem("luxe-session", JSON.stringify(loggedUser));
    setUser(loggedUser);
    setIsAuthenticated(true);
    return true;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    void password;

    const loggedUser: User = {
      name,
      email,
    };

    localStorage.setItem("luxe-session", JSON.stringify(loggedUser));
    setUser(loggedUser);
    setIsAuthenticated(true);
    return true;
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    void email;
    return true;
  };

  const logout = () => {
    localStorage.removeItem("luxe-session");
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const merged = { ...prev, ...updatedUser };
      localStorage.setItem("luxe-session", JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        forgotPassword,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
