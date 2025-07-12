"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  LinkIcon,
  ImageIcon,
  Smile,
} from "lucide-react";
import { useState } from "react";

export default function Editor({ content, onChange, placeholder }) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-4",
          },
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-4",
          },
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 hover:text-blue-800 underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[200px] p-4",
        "data-placeholder": placeholder,
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = linkUrl || window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
      setLinkUrl("");
      setShowLinkDialog(false);
    }
  };

  const addEmoji = (emoji) => {
    editor.chain().focus().insertContent(emoji).run();
  };

  const commonEmojis = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🤔",
    "🤯",
    "😎",
    "🤗",
    "👍",
    "👎",
    "❤️",
    "🎉",
    "🔥",
    "💡",
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 bg-gray-50">
        <div className="flex flex-wrap gap-1">
          {/* Text Formatting */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("bold") ? "bg-gray-200" : ""
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4 text-gray-700" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("italic") ? "bg-gray-200" : ""
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4 text-gray-700" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("strike") ? "bg-gray-200" : ""
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4 text-gray-700" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Lists */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("bulletList") ? "bg-gray-200" : ""
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4 text-gray-700" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("orderedList") ? "bg-gray-200" : ""
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4 text-gray-700" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Alignment */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4 text-gray-700" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4 text-gray-700" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
            }`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4 text-gray-700" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Media */}
          <button
            type="button"
            onClick={addLink}
            className="p-2 rounded hover:bg-gray-200"
            title="Add Link"
          >
            <LinkIcon className="w-4 h-4 text-gray-700" />
          </button>

          <button
            type="button"
            onClick={addImage}
            className="p-2 rounded hover:bg-gray-200"
            title="Add Image"
          >
            <ImageIcon className="w-4 h-4 text-gray-700" />
          </button>

          {/* Emoji Picker */}
          <div className="relative">
            <button
              type="button"
              className="p-2 rounded hover:bg-gray-200"
              onClick={() => setShowLinkDialog(!showLinkDialog)}
              title="Add Emoji"
            >
              <Smile className="w-4 h-4 text-gray-700" />
            </button>

            {showLinkDialog && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
                <div className="flex flex-wrap gap-2 min-w-[300px] max-w-[400px]">
                  {commonEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => addEmoji(emoji)}
                      className="p-1.5 hover:bg-gray-100 rounded text-xl transition-transform hover:scale-125"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Placeholder when empty */}
      {editor.isEmpty && (
        <div className="absolute top-[60px] left-4 text-gray-400 pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
}
