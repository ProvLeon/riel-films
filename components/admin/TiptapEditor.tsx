"use client";

import React from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Undo, Redo, SeparatorHorizontal
} from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (newContent: string) => void;
  placeholder?: string;
  className?: string;
}

// Basic Toolbar Component
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const buttonClass = (isActive?: boolean) =>
    `p-2 rounded transition-colors ${isActive ? 'bg-gray-200 dark:bg-film-black-700' : 'hover:bg-gray-100 dark:hover:bg-film-black-800'}`;

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-film-black-800/50 rounded-t-lg">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={buttonClass(editor.isActive('bold'))}><Bold size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={buttonClass(editor.isActive('italic'))}><Italic size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={buttonClass(editor.isActive('strike'))}><Strikethrough size={16} /></button>
      {/* <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} disabled={!editor.can().chain().focus().toggleCode().run()} className={buttonClass(editor.isActive('code'))}><Code size={16} /></button> */}
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={buttonClass(editor.isActive('heading', { level: 1 }))}><Heading1 size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonClass(editor.isActive('heading', { level: 2 }))}><Heading2 size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={buttonClass(editor.isActive('heading', { level: 3 }))}><Heading3 size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClass(editor.isActive('bulletList'))}><List size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClass(editor.isActive('orderedList'))}><ListOrdered size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={buttonClass(editor.isActive('blockquote'))}><Quote size={16} /></button>
      {/* <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()}><SeparatorHorizontal size={16} /></button> */}
      <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} className={buttonClass()}><Undo size={16} /></button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} className={buttonClass()}><Redo size={16} /></button>
    </div>
  );
};

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange, placeholder, className }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Customize starter kit options if needed
        heading: { levels: [1, 2, 3] },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // Apply Tailwind prose classes for basic styling within the editor
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert focus:outline-none p-4 min-h-[300px] w-full max-w-none',
      },
    },
  });

  return (
    <div className={`border border-border-light dark:border-border-dark rounded-lg ${className}`}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} placeholder={placeholder} />
      {/* Optional Bubble/Floating Menus */}
      {/* {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}> ... </BubbleMenu>} */}
      {/* {editor && <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}> ... </FloatingMenu>} */}
    </div>
  );
};

export default TiptapEditor;
