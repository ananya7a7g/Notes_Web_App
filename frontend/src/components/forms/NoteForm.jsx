import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';
import { validateNote } from '../../validations/note.validation.js';
import { Pin, Eye, Edit2, Bold, Italic, Heading, List, CheckSquare, Code } from 'lucide-react';
import { marked } from 'marked';

// Convert Markdown to HTML for the contenteditable editor
const markdownToHtml = (markdown) => {
  if (!markdown) return '<div><br></div>';
  try {
    let html = marked.parse(markdown);
    
    // First, remove disabled attribute so checkboxes are clickable inside contenteditable
    html = html.replace(/disabled=""/gi, '');
    html = html.replace(/disabled/gi, '');
    
    // Next, style checked items to be green and crossed out
    html = html.replace(/<li[^>]*>\s*<input[^>]*checked[^>]*>\s*(.*?)\s*<\/li>/gi, (match, text) => {
      return `<li class="task-list-item flex items-center" style="text-decoration: line-through; color: #10b981;"><input type="checkbox" checked="checked" class="mr-2 h-4 w-4 rounded border-gray-300 accent-emerald-500 cursor-pointer" /> ${text}</li>`;
    });
    
    // Match unchecked tasks
    html = html.replace(/<li[^>]*>\s*<input[^>]*>\s*(.*?)\s*<\/li>/gi, (match, text) => {
      if (match.includes('checked') || match.includes('text-decoration: line-through')) return match;
      return `<li class="task-list-item flex items-center"><input type="checkbox" class="mr-2 h-4 w-4 rounded border-gray-300 accent-emerald-500 cursor-pointer" /> ${text}</li>`;
    });
    
    return html;
  } catch (e) {
    return markdown;
  }
};

// Convert HTML to Markdown for saving
const htmlToMarkdown = (html) => {
  if (!html) return '';

  let md = html;

  // Replace <br> and <p> with newlines
  md = md.replace(/<br\s*\/?>/gi, '\n');
  md = md.replace(/<\/p>/gi, '\n');
  md = md.replace(/<p[^>]*>/gi, '');

  // Replace bold: <strong> or <b> to **
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');

  // Replace italic: <em> or <i> to *
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

  // Replace checked checklist items: <li> containing checked checkbox
  md = md.replace(/<li[^>]*>\s*<input[^>]*checked[^>]*>\s*(.*?)\s*<\/li>/gi, '- [x] $1\n');
  
  // Replace unchecked checklist items: <li> containing checkbox
  md = md.replace(/<li[^>]*>\s*<input[^>]*type="checkbox"[^>]*>\s*(.*?)\s*<\/li>/gi, '- [ ] $1\n');

  // Replace standard list items: <li> to - and <ul>/</ul> to nothing
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  md = md.replace(/<ul[^>]*>/gi, '');
  md = md.replace(/<\/ul>/gi, '\n');

  // Replace Headings: <h1> to # , <h2> to ## , etc.
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n');

  // Replace pre/code to block code
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '\n```\n$1\n```\n');
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

  // Clean up any remaining HTML tags (like <div>, </div>, etc.)
  md = md.replace(/<[^>]*>/g, '');

  // Decode HTML entities
  try {
    const doc = new DOMParser().parseFromString(md, 'text/html');
    md = doc.documentElement.textContent || doc.body.textContent || md;
  } catch (e) {
    // fallback if DOMParser fails
  }

  // Clean up multiple empty lines
  md = md.replace(/\n{3,}/g, '\n\n');

  return md.trim();
};



export const NoteForm = ({ defaultValues, onSubmit, loading, submitLabel = 'Save Note' }) => {
  const [pinned, setPinned] = useState(defaultValues?.isPinned || false);
  const [selectedColor, setSelectedColor] = useState(defaultValues?.color || 'default');
  const [editorHtml, setEditorHtml] = useState('<div><br></div>');


  // Initialize the editor with parsed HTML from defaultValues.content
  useEffect(() => {
    if (defaultValues?.content) {
      setEditorHtml(markdownToHtml(defaultValues.content));
    }
  }, [defaultValues]);

  const cleanChecklistStyles = (editor) => {
    if (!editor) return;
    const lis = editor.querySelectorAll('li');
    lis.forEach((li) => {
      const checkbox = li.querySelector('input[type="checkbox"]');
      if (checkbox) {
        if (checkbox.checked) {
          checkbox.setAttribute('checked', 'checked');
          li.style.textDecoration = 'line-through';
          li.style.color = '#10b981';
        } else {
          checkbox.removeAttribute('checked');
          li.style.textDecoration = 'none';
          li.style.color = '';
        }
      }
    });
  };

  const handleEditorClick = (e) => {
    if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
      const editor = document.getElementById('content');
      cleanChecklistStyles(editor);
      if (editor) {
        editor.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  const handleEditorInput = (e) => {
    cleanChecklistStyles(e.currentTarget);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    defaultValues: {
      title: '',
      tags: defaultValues?.tags ? defaultValues.tags.join(', ') : '',
      isArchived: false,
      ...defaultValues,
    },
  });

  const handleFormSubmit = async (data) => {
    const editor = document.getElementById('content');
    const htmlContent = editor ? editor.innerHTML : '';
    const markdownContent = htmlToMarkdown(htmlContent);
    data.content = markdownContent;

    const validationErrors = validateNote(data);
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([key, message]) => setError(key, { message }));
      return;
    }

    const tags = data.tags
      ? data.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
      : [];

    const success = await onSubmit({
      title: data.title.trim(),
      content: data.content || '',
      tags,
      isPinned: pinned,
      color: selectedColor,
      ...(data.isArchived !== undefined && { isArchived: data.isArchived }),
    });

    if (success === true) {
      reset();
      if (editor) {
        editor.innerHTML = '<div><br></div>';
      }
      setPinned(false);
      setSelectedColor('default');
    }
  };

  const triggerFormat = (syntax) => {
    const editor = document.getElementById('content');
    if (!editor) return;
    editor.focus();

    if (syntax === 'bold') {
      document.execCommand('bold', false, null);
    } else if (syntax === 'italic') {
      document.execCommand('italic', false, null);
    } else if (syntax === 'heading') {
      document.execCommand('formatBlock', false, '<h2>');
    } else if (syntax === 'list') {
      document.execCommand('insertUnorderedList', false, null);
    } else if (syntax === 'checkbox') {
      document.execCommand('insertHTML', false, '<ul class="list-none pl-0"><li class="task-list-item flex items-center"><input type="checkbox" class="mr-2 h-4 w-4 rounded border-gray-300 accent-emerald-500 cursor-pointer" /> &nbsp;</li></ul>');
    } else if (syntax === 'code') {
      const selection = window.getSelection().toString();
      document.execCommand('insertHTML', false, `<code>${selection || 'code'}</code>`);
    }
  };

  const handleKeyDown = (e) => {
    const isMeta = e.ctrlKey || e.metaKey;

    if (isMeta) {
      if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        document.execCommand('bold', false, null);
      } else if (e.key.toLowerCase() === 'i') {
        e.preventDefault();
        document.execCommand('italic', false, null);
      }
    }

    if (isMeta && e.shiftKey && (e.key === '8' || e.key.toLowerCase() === 'l')) {
      e.preventDefault();
      document.execCommand('insertUnorderedList', false, null);
    }
  };

  const colors = [
    { name: 'default', bg: 'bg-white border-gray-300 dark:bg-zinc-800 dark:border-zinc-700' },
    { name: 'green', bg: 'bg-emerald-100 border-emerald-300 dark:bg-emerald-900/40 dark:border-emerald-800' },
    { name: 'amber', bg: 'bg-amber-100 border-amber-300 dark:bg-amber-900/40 dark:border-amber-800' },
    { name: 'peach', bg: 'bg-orange-100 border-orange-300 dark:bg-orange-900/40 dark:border-orange-800' },
    { name: 'pink', bg: 'bg-rose-100 border-rose-300 dark:bg-rose-900/40 dark:border-rose-800' },
    { name: 'lavender', bg: 'bg-purple-100 border-purple-300 dark:bg-purple-900/40 dark:border-purple-800' },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Title & Pin Toggle */}
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <Input
            id="title"
            label="Title"
            placeholder="Note title"
            error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
          />
        </div>
        <button
          type="button"
          onClick={() => setPinned(!pinned)}
          className={`mb-1 p-3 rounded-full border transition duration-150 ${pinned
              ? 'bg-primary-500 border-primary-600 text-white shadow-md'
              : 'border-white/30 bg-white/20 text-gray-500 hover:bg-white/40 dark:border-white/10 dark:bg-black/20 dark:text-gray-400 dark:hover:bg-black/40'
            }`}
          title={pinned ? 'Pinned note' : 'Pin note'}
        >
          <Pin className="h-5 w-5 transform rotate-45" />
        </button>
      </div>

      {/* Editor Content Box */}
      <section className="space-y-1.5 relative">
        <div className="flex items-center justify-between border-b border-white/20 pb-2">
          {/* Label / Hint */}
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Content
          </span>

          {/* Formatting tools */}
          <div className="flex items-center gap-1 rounded-lg bg-white/10 p-0.5 border border-white/10 dark:bg-black/10">
            <button
              type="button"
              onClick={() => triggerFormat('bold')}
              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-white/20 dark:text-gray-400 dark:hover:text-white rounded transition"
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => triggerFormat('italic')}
              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-white/20 dark:text-gray-400 dark:hover:text-white rounded transition"
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => triggerFormat('heading')}
              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-white/20 dark:text-gray-400 dark:hover:text-white rounded transition"
              title="Heading"
            >
              <Heading className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => triggerFormat('list')}
              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-white/20 dark:text-gray-400 dark:hover:text-white rounded transition"
              title="Bulleted List (Ctrl+Shift+8)"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => triggerFormat('checkbox')}
              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-white/20 dark:text-gray-400 dark:hover:text-white rounded transition"
              title="Task/Checklist"
            >
              <CheckSquare className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => triggerFormat('code')}
              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-white/20 dark:text-gray-400 dark:hover:text-white rounded transition"
              title="Code Block"
            >
              <Code className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Contenteditable Rich Editor */}
        <div
          id="content"
          contentEditable
          onKeyDown={handleKeyDown}
          onClick={handleEditorClick}
          onInput={handleEditorInput}
          dangerouslySetInnerHTML={{ __html: editorHtml }}
          className="input-field min-h-[min(65vh,580px)] overflow-y-auto px-6 py-6 border border-white/30 bg-white/20 backdrop-blur-md rounded-3xl dark:border-white/10 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary-500 text-left prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-p:my-2 prose-ul:list-disc prose-ul:pl-4 prose-ol:list-decimal prose-ol:pl-4 prose-code:bg-black/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded dark:prose-code:bg-white/15"
          placeholder="Write your note here..."
        />
        {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
      </section>

      {/* Dynamic Tags */}
      <Input
        id="tags"
        label="Tags"
        placeholder="work, ideas, personal (comma separated)"
        {...register('tags')}
      />

      {/* Pastel Colors Picker */}
      <section className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Note Color Theme
        </label>
        <div className="flex flex-wrap gap-2.5">
          {colors.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => setSelectedColor(color.name)}
              className={`w-8 h-8 rounded-full border-2 transition duration-150 transform hover:scale-105 ${color.bg} ${selectedColor === color.name
                  ? 'ring-2 ring-primary-500 scale-105 border-white dark:border-zinc-900'
                  : 'border-transparent shadow-sm'
                }`}
              title={`Paste color: ${color.name}`}
            />
          ))}
        </div>
      </section>

      {defaultValues?.isArchived !== undefined && (
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" className="rounded border-gray-300" {...register('isArchived')} />
          Archive this note
        </label>
      )}

      <Button type="submit" loading={loading}>
        {submitLabel}
      </Button>
    </form>
  );
};
