// app/SessionProvider.tsx
"use client";

import React, { createContext, useContext } from "react";

export interface SessionContext {
  user: {
    id: string;
    username?: string;
    email?: string;
    name?: string;
    avatarUrl?: string;
    followers?: any[]; 
    following?: any[];
    bio?: string;
    [key: string]: any;
  };
  token: string;
}


const SessionContext = createContext<SessionContext | null>(null);

export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContext | null }>) {
  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === null) {
    throw new Error("No active session");
  }
  return context;
}
