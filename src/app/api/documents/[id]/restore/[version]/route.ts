import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: { id: string; version: string } }) {
  const snap = await prisma.snapshot.findFirst({
    where: { documentId: params.id, version: parseInt(params.version) },
  });
  if (!snap) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new Response(snap.state, { headers: { "Content-Type": "application/octet-stream" } });
}
