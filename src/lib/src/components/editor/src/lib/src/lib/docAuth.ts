import { prisma } from "./prisma";

export async function canAccessDocument(userId: string, docId: string) {
  const collab = await prisma.collaborator.findFirst({
    where: { documentId: docId, userId },
  });
  return !!collab;
}

export async function canEditDocument(userId: string, docId: string) {
  const collab = await prisma.collaborator.findFirst({
    where: { documentId: docId, userId },
  });
  return collab?.role === "OWNER" || collab?.role === "EDITOR";
}
