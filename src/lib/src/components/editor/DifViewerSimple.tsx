"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { diffLines } from "diff";

export default function DiffViewerSimple({ textLeft, textRight }: { textLeft: string; textRight: string }) {
  const [showChangesOnly, setShowChangesOnly] = useState(false);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => {
    const parts = diffLines(textLeft, textRight);
    const out: { op: "equal" | "add" | "del"; left?: string; right?: string }[] = [];
    for (const p of parts) {
      const lines = p.value.split("\n");
      if (lines[lines.length - 1] === "") lines.pop();
      if (p.added) lines.forEach(l => out.push({ op: "add", right: l }));
      else if (p.removed) lines.forEach(l => out.push({ op: "del", left: l }));
      else lines.forEach(l => out.push({ op: "equal", left: l, right: l }));
    }
    return out;
  }, [textLeft, textRight]);

  const filtered = showChangesOnly ? rows.filter(r => r.op !== "equal") : rows;

  useEffect(() => {
    const left = leftRef.current, right = rightRef.current;
    if (!left || !right) return;
    const sync = (src: HTMLElement, dest: HTMLElement) => { dest.scrollTop = src.scrollTop; };
    const onLeft = () => sync(left!, right!);
    const onRight = () => sync(right!, left!);
    left.addEventListener("scroll", on
