"use client";
import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import Toolbar from "./Toolbar";
import PresenceBar from "./PresenceBar";
import OfflineBanner from "./OfflineBanner";

export default function Editor({ docId }: { docId: string }) {
  const [online, setOnline] = useState(true);
  const ydocRef = useRef<Y.Doc | null>(null);
  const wsProviderRef = useRef<WebsocketProvider | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Collaboration.configure({ document: new Y.XmlFragment("prosemirror") }),
      CollaborationCursor.configure({
        provider: () => wsProviderRef.current!,
        user: { name: "You", color: "#3b82f6" },
      }),
    ],
    content: "",
    autofocus: true,
    onUpdate: () => {
      const el = document.getElementById("autosave-indicator");
      if (!el) return;
      el.textContent = "Saving…";
      window.clearTimeout((window as any).__autosaveTimer);
      (window as any).__autosaveTimer = setTimeout(() => (el.textContent = "Saved"), 500);
    },
  });

  useEffect(() => {
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    (async () => {
      const res = await fetch(`/api/documents/${docId}/snapshot`);
      if (res.ok && res.headers.get("Content-Type") === "application/octet-stream") {
        const ab = await res.arrayBuffer();
        Y.applyUpdate(ydoc, new Uint8Array(ab));
      }
      const url = process.env.NEXT_PUBLIC_WS_URL!;
      const provider = new WebsocketProvider(url, docId, ydoc);
      wsProviderRef.current = provider;

      provider.on("status", ({ status }: any) => setOnline(status === "connected"));
      provider.awareness.setLocalStateField("user", { name: "You", color: "#3b82f6" });

      const interval = setInterval(async () => {
        const update = Y.encodeStateAsUpdate(ydoc);
        await fetch(`/api/documents/${docId}/snapshot`, { method: "POST", body: update });
      }, 15000);

      return () => {
        clearInterval(interval);
        provider.destroy();
        ydoc.destroy();
      };
    })();
  }, [docId]);

  return (
    <div className="space-y-3">
      <OfflineBanner online={online} />
      <PresenceBar providerRef={wsProviderRef} />
      <Toolbar editor={editor} />
      <div className="prose max-w-none border rounded p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
