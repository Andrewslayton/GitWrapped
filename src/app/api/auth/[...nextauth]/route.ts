import NextAuth, { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { Session } from "next-auth";
import { z } from "zod";

// Schema for env variables, Zod is a schema validation library type checker
const envSchema = z.object({
  GITHUB_ID: z.string(),
  GITHUB_SECRET: z.string(),
});

const env = envSchema.parse(process.env);

export const authOptions: AuthOptions = {
  providers: [
    // these are already validated by zod, no need to check them.
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: "repo",
        },
      },
    }),
  ],
  callbacks: {
    jwt({ token, account }) {
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
    session({ session , token  } : { session: Session, token: any }) {
      if (token.accessToken) {
        session.user.accessToken = token.accessToken;
      }
      return session; // The return type will match the one returned in `useSession()`
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
