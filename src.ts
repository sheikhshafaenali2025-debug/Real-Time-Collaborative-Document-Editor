import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: { email: { label: "Email", type: "text" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user?.hashedPassword) return null;
        const ok = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!ok) return null;
        return { id: user.id, name: user.name, email: user.email, image: user.image || undefined };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) { if (user?.id) token.sub = user.id; return token; },
    async session({ session, token }) {
      if (session.user && token.sub) { (session.user as any).id = token.sub; }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
