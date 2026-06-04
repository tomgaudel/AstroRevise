import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, List, Link2 } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Écrivez votre note ici...',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const addLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="flex gap-1 p-2 bg-slate-100 border-b border-slate-200">
        <button
          onClick={toggleBold}
          className={`p-2 rounded transition ${
            editor.isActive('bold')
              ? 'bg-neon-purple text-white'
              : 'bg-white text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Bold size={18} />
        </button>
        <button
          onClick={toggleItalic}
          className={`p-2 rounded transition ${
            editor.isActive('italic')
              ? 'bg-neon-purple text-white'
              : 'bg-white text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Italic size={18} />
        </button>
        <button
          onClick={toggleBulletList}
          className={`p-2 rounded transition ${
            editor.isActive('bulletList')
              ? 'bg-neon-purple text-white'
              : 'bg-white text-slate-600 hover:bg-slate-200'
          }`}
        >
          <List size={18} />
        </button>
        <button
          onClick={addLink}
          className={`p-2 rounded transition ${
            editor.isActive('link')
              ? 'bg-neon-purple text-white'
              : 'bg-white text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Link2 size={18} />
        </button>
      </div>
      <EditorContent editor={editor} className="prose prose-sm max-w-none p-4 min-h-64" />
    </div>
  );
};
