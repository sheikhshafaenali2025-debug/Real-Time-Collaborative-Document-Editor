import { diffLines } from "diff";

export type LineOp = "equal" | "add" | "del";
export type DiffLine = { op: LineOp; left?: string; right?: string };

export function makeSideBySide(linesA: string, linesB: string): DiffLine[] {
  const parts = diffLines(linesA, linesB);
  const out: DiffLine[] = [];
  for (const p of parts) {
    const lines = p.value.split("\n");
    if (lines[lines.length - 1] === "") lines.pop();

    if (p.added) {
      for (const l of lines) out.push({ op: "add", left: "", right: l });
    } else if (p.removed) {
      for (const l of lines) out.push({ op: "del", left: l, right: "" });
    } else {
      for (const l of lines) out.push({ op: "equal", left: l, right: l });
    }
  }
  return out;
}
