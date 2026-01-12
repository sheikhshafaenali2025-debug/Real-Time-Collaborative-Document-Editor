import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canAccessDocument, canEditDocument } from "@/lib/docAuth";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await canAccessDocument((session.user as any).id, params.id))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const doc = await prisma.document.findUnique({ where: { id: params.id } });
  if (!doc || doc.isDeleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await canEditDocument((session.user as any).id, params.id))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title } = await req.json();
  const doc = await prisma.document.update({ where: { id: params.id }, data: { title, lastEditedBy: (session.user as any).id } });
  return NextResponse.json(doc);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await canEditDocument((session.user as any).id, params.id))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const doc = await prisma.document.update({ where: { id: params.id }, data: { isDeleted: true } });
  return NextResponse.json(doc);
}
