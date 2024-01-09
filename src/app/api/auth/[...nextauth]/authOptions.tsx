import { AuthOptions } from "next-auth";
import { Session } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
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
      if (account) {
        console.log(JSON.stringify(account));
      }
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    session({ session, token }: { session: Session; token: any }) {
      console.log(token.accessToken);
      if (token?.accessToken) {
        session.user.accessToken = token.accessToken;
      }
      return session; // The return type will match the one returned in `useSession()`
    },
  },
};
