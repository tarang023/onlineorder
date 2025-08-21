// components/LoginButtons.jsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <p>Welcome, {session.user.name}!</p>
        <img src={session.user.image} alt="Profile Picture" style={{ borderRadius: '50%', width: '50px' }} />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <>
      <p>You are not signed in.</p>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
      <button onClick={() => signIn("facebook")}>Sign in with Facebook</button>
    </>
  );
}