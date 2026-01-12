import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canAccessDocument } from "@/lib/docAuth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await canAccessDocument((session.user as any).id, params.id))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.arrayBuffer();
  const bytes = Buffer.from(body);
  const last = await prisma.snapshot.findFirst({ where: { documentId: params.id }, orderBy: { version: "desc" } });
  const snap = await prisma.snapshot.create({
    data: { documentId: params.id, version: (last?.version ?? 0) + 1, state: bytes, createdBy: (session.user as any).id },
  });
  return NextResponse.json({ version: snap.version });
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await canAccessDocument((session.user as any).id, params.id))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const snap = await prisma.snapshot.findFirst({ where: { documentId: params.id }, orderBy: { version: "desc" } });
  if (!snap) return NextResponse.json({ state: null });
  return new Response(snap.state, { headers: { "Content-Type": "application/octet-stream" } });
}
