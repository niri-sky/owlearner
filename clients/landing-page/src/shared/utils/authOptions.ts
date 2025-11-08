import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

const GET_STUDENT = gql`
  query GetStudent($email: String!) {
    studentWithEmail(email: $email) {
      id
      name
      email
      profile
      joinedAt
    }
  }
`;

const CREATE_STUDENT = gql`
  mutation CreateStudent($input: StudentCreateInput!) {
    createStudent(createStudentInput: $input) {
      id
      name
      email
      profile
      joinedAt
    }
  }
`;

const client = new ApolloClient({
  uri: SERVER_URI + "/graphql",
  cache: new InMemoryCache(),
});

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  providers: [
    CredentialsProvider({
      id: "student-auth",
      name: "Student Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const response = await fetch(SERVER_URI + "/graphql", {
          method: "POST",
          body: JSON.stringify({
            query: `mutation {
              loginStudent(loginInput:{
                email: "${credentials?.email || ""}"
                password: "${credentials?.password || ""}"
              }){
                id
                name
                email
                profile
                joinedAt
              }
            }`,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((r) => r.json());

        if (response?.errors) {
          const errMessage = response?.errors?.[0]?.message;
          if (errMessage) {
            throw new Error(errMessage);
          }
        }

        let data = response?.data?.loginStudent;

        if (!data) throw new Error("Invalid credentials");

        return {
          ...data,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",

      profile: async (profile, tokens) => {
        try {
          const { data } = await client.query({
            query: GET_STUDENT,
            variables: { email: profile.email },
          });
          const std = data.student;
          return {
            id: std.id,
            name: std.name,
            email: std.email,
            profile: std.profile,
            joinedAt: std.joinedAt,
          };
        } catch (error) {
          const { data } = await client.mutate({
            mutation: CREATE_STUDENT,
            variables: {
              input: {
                name: profile.name,
                email: profile.email,
                profile: profile.picture,
                verified: true,
              },
            },
          });

          const std = data.createStudent;
          return {
            id: std.id,
            name: std.name,
            email: std.email,
            profile: std.profile,
            joinedAt: std.joinedAt,
          };
        }
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",

      profile: async (profile, tokens) => {
        try {
          const { data } = await client.query({
            query: GET_STUDENT,
            variables: { email: Number(profile.email) },
          });
          const std = data.student;
          return {
            id: std.id,
            name: std.name,
            email: std.email,
            profile: std.profile,
            joinedAt: std.joinedAt,
          };
        } catch (error) {
          const { data } = await client.mutate({
            mutation: CREATE_STUDENT,
            variables: {
              input: {
                name: profile.name,
                email: profile.email,
                profile: profile.picture.data.url,
                verified: true,
              },
            },
          });

          const std = data.createStudent;
          return {
            id: std.id,
            name: std.name,
            email: std.email,
            profile: std.profile,
            joinedAt: std.joinedAt,
          };
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",

      profile: async (profile, tokens) => {
        try {
          const { data } = await client.query({
            query: GET_STUDENT,
            variables: { email: profile.email },
          });
          const std = data.student;
          return {
            id: std.id,
            name: std.name,
            email: std.email,
            profile: std.profile,
            joinedAt: std.joinedAt,
          };
        } catch (error) {
          const { data } = await client.mutate({
            mutation: CREATE_STUDENT,
            variables: {
              input: {
                name: profile.name ?? profile.login,
                email: profile.email,
                profile: profile.avatar_url,
                verified: true,
              },
            },
          });

          const std = data.createStudent;
          return {
            id: std.id,
            name: std.name,
            email: std.email,
            profile: std.profile,
            joinedAt: std.joinedAt,
          };
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) token.user = user as any;
      if (trigger === "update" && session.user) {
        token.user = session.user;
      }
      return token;
    },

    async session({ token, session }: any) {
      session.user = token.user;
      return session;
    },
  },
};
