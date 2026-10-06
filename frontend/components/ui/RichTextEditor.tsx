"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  RemoveFormatting,
} from "lucide-react";
import { useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  label?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Write content here...", label }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-emerald-600 underline font-medium hover:text-emerald-700",
        },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm md:prose-base focus:outline-none min-h-[160px] max-h-[400px] overflow-y-auto p-4 text-gray-800 dark:text-gray-200",
      },
    },
  });

  // Keep editor content in sync if external value changes drastically (e.g. form reset or item load)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      // Avoid resetting cursor if value matches plain text
      if (editor.getText() === "" && value === "") {
        editor.commands.setContent("");
      } else if (Math.abs(editor.getHTML().length - (value || "").length) > 5) {
        editor.commands.setContent(value || "");
      }
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("URL", editor.getAttributes("link").href || "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-300">{label}</label>}
      <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-2xs focus-within:border-[#00B074]">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 select-none">
          {/* Text Style formatting */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
              editor.isActive("bold") ? "bg-emerald-100 dark:bg-emerald-950 text-[#00B074] font-bold" : ""
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
              editor.isActive("italic") ? "bg-emerald-100 dark:bg-emerald-950 text-[#00B074]" : ""
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
              editor.isActive("underline") ? "bg-emerald-100 dark:bg-emerald-950 text-[#00B074]" : ""
            }`}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
              editor.isActive("strike") ? "bg-emerald-100 dark:bg-emerald-950 text-[#00B074]" : ""
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

          {/* Headings */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
              editor.isActive("heading", { level: 2 }) ? "bg-emerald-100 dark:bg-emerald-950 text-[#00B074] font-bold" : ""
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
              editor.isActive("heading", { level: 3 }) ? "bg-emerald-100 dark:bg-emerald-950 text-[#00B074] font-bold" : ""
            }`}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            className={`p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
              editor.isActive("heading", { level: 4 }) ? "bg-emerald-100 dark:bg-emerald-950 text-[#00B074] font-bold" : ""
            }`}
            title="Heading 4"
          >
            <Heading4 className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

          {/* Alignments */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
              editor.isActive({ textAlign: "left" }) ? "bg-emerald-100 dark:bg-emerald-950 text-[#00B074]" : ""
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
              editor.isActive({ textAlign: "center" }) ? "bg-emerald-100 dark:bg-emerald-950 text-[#00B074]" : ""
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
              editor.isActive({ textAlign: "right" }) ? "bg-emerald-100 dark:bg-emerald-950 text-[#00B074]" : ""
            }`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={`p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
              editor.isActive({ textAlign: "justify" }) ? "bg-emerald-100 dark:bg-emerald-950 text-[#00B074]" : ""
            }`}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
              editor.isActive("bulletList") ? "bg-emerald-100 dark:bg-emerald-950 text-[#00B074]" : ""
            }`}
            title="Bulleted List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
              editor.isActive("orderedList") ? "bg-emerald-100 dark:bg-emerald-950 text-[#00B074]" : ""
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
              editor.isActive("blockquote") ? "bg-emerald-100 dark:bg-emerald-950 text-[#00B074]" : ""
            }`}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

          {/* Link & Clear */}
          <button
            type="button"
            onClick={addLink}
            className={`p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
              editor.isActive("link") ? "bg-emerald-100 dark:bg-emerald-950 text-[#00B074]" : ""
            }`}
            title="Insert Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors cursor-pointer"
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>

        {/* Editor Area */}
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
    </div>
  );
}
