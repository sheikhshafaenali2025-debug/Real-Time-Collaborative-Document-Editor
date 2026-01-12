"use client";
import { useEffect, useState } from "react";

export default function CommentSidebar({ docId }: { docId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  useEffect(() => {
    fetch(`/api/documents/${docId}/comments`).then(r => r.json()).then(setComments);
  }, [docId]);

  return (
    <aside className="border-l w-64 p-2 space-y-2">
      <h2 className="font-semibold">Comments</h2>
      {comments.map(c => (
        <div key={c.id} className="border rounded p-2 text-sm">
          <div className="font-medium">{c.user.name}</div>
          <div>{c.content}</div>
          <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </aside>
  );
}
