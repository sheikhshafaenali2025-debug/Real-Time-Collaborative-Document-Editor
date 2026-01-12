"use client";
import { Editor } from "@tiptap/react";

export default function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;
  const btn = "px-2 py-1 rounded hover:bg-gray-100";
  return (
    <div className="flex flex-wrap gap-2 border-b p-2 sticky top-0 bg-white z-10">
      <button className={btn} onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
      <button className={btn} onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
      <button className={btn} onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullets</button>
      <button className={btn} onClick={() => editor.chain().focus().toggleOrderedList().run()}>Numbered</button>
      <button className={btn} onClick={() => editor.chain().focus().setParagraph().run()}>Paragraph</button>
      <span className="ml-auto text-sm text-gray-500">Autosave active</span>
    </div>
  );
}
