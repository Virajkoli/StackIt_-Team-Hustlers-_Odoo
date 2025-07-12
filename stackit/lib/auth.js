import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.emailOrUsername || !credentials?.password) {
            return null
          }

          // Check if input is email or username
          const isEmail = credentials.emailOrUsername.includes('@')
          
          const user = await prisma.user.findFirst({
            where: isEmail 
              ? { email: credentials.emailOrUsername }
              : { username: credentials.emailOrUsername }
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password || ""
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            role: user.role,
            image: user.image,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.username = user.username
        token.image = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.username = token.username
        session.user.image = token.image
        
        // Always fetch the latest role from database to ensure role changes are reflected
        if (token.sub) {
          try {
            const user = await prisma.user.findUnique({
              where: { id: token.sub },
              select: { role: true }
            });
            session.user.role = user?.role || token.role;
          } catch (error) {
            console.error('Error fetching user role:', error);
            session.user.role = token.role;
          }
        } else {
          session.user.role = token.role;
        }
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    signUp: "/register",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
}
