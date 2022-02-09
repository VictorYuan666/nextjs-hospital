import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import prisma from "../../../lib/prisma";

export default NextAuth({
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {
        username: {
          label: "Email",
          type: "text",
          placeholder: "johndoe@test.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // database look up
        console.log(credentials);
        const user = await prisma.user.findFirst({
          where: {
            name: credentials.username,
            password: credentials.password,
          },
        });
        console.log(user);

        return user;
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      // first time jwt callback is run, user object is available
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
      }

      return session;
    },
  },
  secret: "test",
  jwt: {
    secret: "test",
    encryption: true,
  },
  pages: {
    // signIn: "auth/login",
  },
});
