import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Undo,
  Redo
} from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { useEffect, useCallback } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  "data-testid"?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "ابدأ الكتابة...",
  className,
  minHeight = "150px",
  "data-testid": testId
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none focus:outline-none min-h-[inherit] p-3 text-right',
          'prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground',
          'prose-ul:list-disc prose-ol:list-decimal prose-ul:mr-4 prose-ol:mr-4'
        ),
        dir: 'rtl',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('أدخل رابط URL:', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div 
      className={cn("border rounded-md overflow-hidden bg-background", className)}
      data-testid={testId}
    >
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30" dir="rtl">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive('bold') && "bg-muted")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="غامق"
          data-testid={`${testId}-bold`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive('italic') && "bg-muted")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="مائل"
          data-testid={`${testId}-italic`}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive('underline') && "bg-muted")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="تسطير"
          data-testid={`${testId}-underline`}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border self-center mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive('heading', { level: 1 }) && "bg-muted")}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="عنوان رئيسي"
          data-testid={`${testId}-h1`}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive('heading', { level: 2 }) && "bg-muted")}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="عنوان فرعي"
          data-testid={`${testId}-h2`}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border self-center mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive('bulletList') && "bg-muted")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="قائمة نقطية"
          data-testid={`${testId}-bullet`}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive('orderedList') && "bg-muted")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="قائمة مرقمة"
          data-testid={`${testId}-ordered`}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border self-center mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive({ textAlign: 'right' }) && "bg-muted")}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="محاذاة يمين"
          data-testid={`${testId}-align-right`}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive({ textAlign: 'center' }) && "bg-muted")}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="محاذاة وسط"
          data-testid={`${testId}-align-center`}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive({ textAlign: 'left' }) && "bg-muted")}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="محاذاة يسار"
          data-testid={`${testId}-align-left`}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border self-center mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive('link') && "bg-muted")}
          onClick={setLink}
          title="رابط"
          data-testid={`${testId}-link`}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border self-center mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="تراجع"
          data-testid={`${testId}-undo`}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="إعادة"
          data-testid={`${testId}-redo`}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      
      <div style={{ minHeight }} className="overflow-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
