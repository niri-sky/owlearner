// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
loadDevMessages();
loadErrorMessages();

const SERVER_URI =
  process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:4000";

const httpLink = new HttpLink({
  uri: SERVER_URI + "/graphql",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: replaceHttpWithWs(SERVER_URI) + "/subscriptions",
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export function Providers({ children }: { children: React.ReactNode }) {
  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });

  return (
    <SessionProvider>
      <Toaster />
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </SessionProvider>
  );
}

function replaceHttpWithWs(url: string) {
  if (url.startsWith("https")) {
    return url.replace(/^https?:\/\//, "wss://");
  } else {
    return url.replace(/^https?:\/\//, "ws://");
  }
}
