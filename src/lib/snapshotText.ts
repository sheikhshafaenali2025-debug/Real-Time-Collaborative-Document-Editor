import * as Y from "yjs";

export function ySnapshotToText(snapshotBytes: ArrayBuffer): string {
  const doc = new Y.Doc();
  Y.applyUpdate(doc, new Uint8Array(snapshotBytes));
  const t = doc.getText("prosemirror");
  return t.toString();
}
