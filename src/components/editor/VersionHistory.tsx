"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DiffViewerSimple from "./DiffViewerSimple";
import { ySnapshotToText } from "@/lib/snapshotText";

export default function VersionHistory({ docId }: { docId: string }) {
  const [versions, setVersions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [left, setLeft] = useState<number | null>(null);
  const [right, setRight] = useState<number | null>(null);
  const [textLeft, setTextLeft] = useState<string>("");
  const [textRight, setTextRight] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    fetch(`/api/documents/${docId}/versions`).then(r => r.json()).then(setVersions);
  }, [open, docId]);

  useEffect(() => {
    const loadSnapshot = async (v: number, setter: (t: string) => void) => {
      const res = await fetch(`/api/documents/${docId}/restore/${v}`, { method: "POST" });
      if (!res.ok) return;
      const ab = await res.arrayBuffer();
      setter(ySnapshotToText(ab));
    };
    if (left) loadSnapshot(left, setTextLeft);
    if (right) loadSnapshot(right, setTextRight);
  }, [left, right, docId]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>History</Button>
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded p-4 w-[800px] space-y-3">
            <div className
