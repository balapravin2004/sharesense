import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password required" }),
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 400,
      });

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword)
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 400,
      });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return new Response(
      JSON.stringify({
        user: { id: user.id, name: user.name, email: user.email },
        token, // <-- return token along with user
      }),
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=${
            7 * 24 * 60 * 60
          }`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
