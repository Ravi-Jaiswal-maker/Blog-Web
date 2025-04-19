import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { FaBold, FaItalic, FaUnderline, FaLink } from "react-icons/fa";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const setLink = () => {
    let url = prompt("Enter URL");

    if (!url) return;

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const btnClass =
    "bg-violet-100 hover:bg-violet-200 text-violet-700 font-semibold px-3 py-1 rounded transition";

  return (
    <div className="flex gap-2 flex-wrap mb-4 border-b pb-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass}
      >
        <FaBold />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass}
      >
        <FaItalic />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btnClass}
      >
        <FaUnderline />
      </button>
      <button type="button" onClick={setLink} className={btnClass}>
        <FaLink />
      </button>
    </div>
  );
};

const TiptapEditor = ({ content, onContentChange }) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline, Link.configure({ openOnClick: false })],
    content,
    onUpdate({ editor }) {
      onContentChange(editor.getHTML());
    },
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <div className="border rounded-lg p-3 min-h-[150px]">
        <EditorContent
          editor={editor}
          className="prose max-w-none outline-none"
        />
      </div>
    </div>
  );
};

export default TiptapEditor;
