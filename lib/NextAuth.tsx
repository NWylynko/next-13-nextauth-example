'use client';

import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth/core/types"
import React from "react"

interface NextAuthProps { 
  children: React.ReactNode,
  session?: Session | null;
}

export default function NextAuth({ children, session }: NextAuthProps) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}