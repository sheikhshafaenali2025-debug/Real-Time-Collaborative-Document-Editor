import ws from "ws";
import jwt from "jsonwebtoken";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";

type Client = { socket: ws; userId: string };
type Room = { ydoc: Y.Doc; awareness: Awareness; clients: Set<Client>; lastPersist: number };

const rooms = new Map<string, Room>();
const wss = new ws.Server({ port: 8080 });

function getRoom(docId: string): Room {
  let room = rooms.get(docId);
  if (!room) {
    const ydoc = new Y.Doc();
    const awareness = new Awareness(ydoc);
    room = { ydoc, awareness, clients: new Set(), lastPersist: Date.now() };
    rooms.set(docId, room);
  }
  return room;
}

wss.on("connection", (socket, req) => {
  const url = new URL(req.url!, "http://localhost");
  const docId = url.pathname.replace("/", "");
  const token = url.searchParams.get("token");
  if (!token) return socket.close();

  let userId = "";
  try { userId = (jwt.verify(token, process.env.JWT_SECRET!) as any).sub; } catch { return socket.close(); }

  const room = getRoom(docId);
  const client: Client = { socket, userId };
  room.clients.add(client);

  socket.on("message", (data) => {
    const update = new Uint8Array(data as Buffer);
    Y.applyUpdate(room.ydoc, update);
    for (const c of room.clients) {
      if (c.socket !== socket && c.socket.readyState === ws.OPEN) {
        c.socket.send(update);
      }
    }

    const now = Date.now();
    if (now - room.lastPersist > 10_000) {
      // TODO: Persist snapshot to DB
      room.lastPersist = now;
    }
  });

  socket.on("close", () => {
    room.clients.delete(client);
    if (room.clients.size === 0) {
      // Final snapshot before cleanup (optional)
      rooms.delete(docId);
    }
  });
});

console.log("WS server listening on :8080");
