import React, { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { FaBold, FaItalic, FaUnderline, FaLink } from "react-icons/fa";

const MenuBar = ({ editor }) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [url, setUrl] = useState("");

  if (!editor) return null;

  const applyLink = () => {
    let link = url.trim();

    if (!link) return;

    if (!link.startsWith("http://") && !link.startsWith("https://")) {
      link = "https://" + link;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: link })
      .run();
    setShowLinkInput(false);
    setUrl("");
  };

  const btnClass =
    "bg-violet-100 hover:bg-violet-200 text-violet-700 font-semibold px-3 py-1 rounded transition";

  return (
    <div className="flex gap-2 flex-wrap mb-4 border-b pb-2 relative">
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
      <button
        type="button"
        onClick={() => setShowLinkInput(true)}
        className={btnClass}
      >
        <FaLink />
      </button>

      {showLinkInput && (
        <div className="absolute top-12 left-0 bg-white shadow-md p-3 rounded-md flex gap-2 z-50">
          <input
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border px-2 py-1 rounded w-64"
            autoFocus
          />
          <button
            onClick={applyLink}
            className="bg-violet-600 text-white px-3 py-1 rounded hover:bg-violet-700"
          >
            Apply
          </button>
          <button
            onClick={() => {
              setShowLinkInput(false);
              setUrl("");
            }}
            className="text-gray-500 hover:text-gray-700 px-2"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

const TiptapEditor = ({ content, onContentChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800",
        },
      }),
    ],
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
