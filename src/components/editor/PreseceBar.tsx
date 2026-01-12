"use client";
import { RefObject, useEffect, useState } from "react";
import { WebsocketProvider } from "y-websocket";

export default function PresenceBar({ providerRef }: { providerRef: RefObject<WebsocketProvider | null> }) {
  const [users, setUsers] = useState<{ name: string; color: string }[]>([]);
  useEffect(() => {
    const provider = providerRef.current;
    if (!provider) return;
    const awareness = provider.awareness;
    const update = () => {
      const states = Array.from(awareness.getStates().values()) as any[];
      setUsers(states.map((s) => s.user).filter(Boolean));
    };
    awareness.on("change", update);
    update();
    return () => { awareness.off("change", update); };
  }, [providerRef]);

  if (users.length === 0) return null;
  return (
    <div className="flex items-center gap-2 text-sm">
      {users.slice(0, 5).map((u, i) => (
        <div key={i} className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: u.color }} />
          <span>{u.name}</span>
        </div>
      ))}
      {users.length > 5 && <span className="text-gray-500">+{users.length - 5}</span>}
    </div>
  );
}
