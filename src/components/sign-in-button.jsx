'use client'

import { signIn, useSession, signOut } from "next-auth/react"
import React from 'react'

export default function SignInButton() {
  const { data: session } = useSession();
  console.log(session)

  return (
    <>
      {
        session ? (
          <img 
            src={session.user.image} 
            alt={session.user.name} 
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={signOut}
          />
        ) : (
          <button
            onClick={signIn}
            className='text-sm font-semibold text-blue-500'
          >Log in</button>
        )
      }
    </>
  )
}
