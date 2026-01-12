import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const doc = await prisma.document.create({
    data: {
      title: "Untitled",
      ownerId: (session.user as any).id,
      collaborators: { create: [{ userId: (session.user as any).id, role: "OWNER" }] },
    },
  });

  return NextResponse.redirect(new URL(`/documents/${doc.id}`, process.env.NEXTAUTH_URL));
}
