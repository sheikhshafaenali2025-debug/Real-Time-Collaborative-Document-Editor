import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const snaps = await prisma.snapshot.findMany({
    where: { documentId: params.id },
    orderBy: { version: "desc" },
  });
  return NextResponse.json(snaps.map(s => ({ version: s.version, createdAt: s.createdAt })));
}
