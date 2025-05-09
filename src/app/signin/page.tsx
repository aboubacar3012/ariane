"use client";

import { authClient } from "@/src/lib/auth-client";


export default function SignInPage() {
  const handleSignIn = async () => {
    await authClient.signIn.social({ provider: "github" });
  };

  return (
    <div>
      <h1>Connexion</h1>
      <button onClick={handleSignIn}>Se connecter avec GitHub</button>
    </div>
  );
}
