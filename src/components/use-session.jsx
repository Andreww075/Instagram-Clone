'use client'

import { useSession } from "next-auth/react"

export default function UseSession() {
  const { data: session } = useSession();
  console.log(session)

  return session;
}
