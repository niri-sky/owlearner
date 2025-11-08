import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  providers: [
    CredentialsProvider({
      id: "teacher-auth",
      name: "Teacher Credentials",

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
              loginTeacher(loginInput:{
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
        console.log(response);
        let data = response?.data?.loginTeacher;

        if (!data) throw new Error("Invalid credentials");

        return {
          ...data,
        };
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
