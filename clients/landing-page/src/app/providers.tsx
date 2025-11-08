// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { useEffect, useState } from "react";

const SERVER_URI =
  process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:4000";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  const client = new ApolloClient({
    uri: SERVER_URI + "/graphql",
    cache: new InMemoryCache(),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return;
  }

  return (
    <SessionProvider>
      <Toaster />
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </SessionProvider>
  );
}
