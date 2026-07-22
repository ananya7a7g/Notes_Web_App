import { Link } from 'react-router-dom';
import { Archive, Clock, History, Pin, Share2, Tag } from 'lucide-react';
import { formatRelative } from '../../utils/formatDate.js';
import { NoteContent } from './NoteContent.jsx';
import { noteService } from '../../services/note.service.js';
import { toast } from 'react-toastify';

const stripMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/[#*`_~\[\]()\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const NoteCard = ({ note, index = 0, square = false, onUpdate }) => {
  const styleType = index % 3;

  let cardClass = '';
  let titleClass = '';
  let contentClass = '';
  let tagClass = '';
  let linkClass = '';
  let metaClass = '';

  const colorTheme = note.color || 'default';

  if (colorTheme === 'default') {
    if (styleType === 0) {
      // Charcoal theme
      cardClass = 'bg-[#211f26] text-white border border-neutral-800/80 shadow-lg rounded-3xl p-6 backdrop-blur-md transition duration-200 hover:scale-[1.01] hover:shadow-xl';
      titleClass = 'text-white font-bold group-hover:text-primary-300';
      contentClass = 'text-neutral-300 dark:text-neutral-300';
      tagClass = 'bg-white/10 text-neutral-200 border border-white/10';
      linkClass = 'text-primary-300 hover:text-primary-200';
      metaClass = 'text-neutral-400';
    } else if (styleType === 1) {
      // Mesh Gradient theme
      cardClass = 'bg-gradient-to-tr from-[#fbcfe8] via-[#ffe4e6] to-[#ffdcb8] text-[#1c1b1f] border border-white/40 shadow-md rounded-3xl p-6 transition duration-200 hover:scale-[1.01] hover:shadow-lg';
      titleClass = 'text-gray-900 font-bold group-hover:text-primary-700';
      contentClass = 'text-gray-700 dark:text-gray-800';
      tagClass = 'bg-black/10 text-gray-800 border border-black/5';
      linkClass = 'text-primary-700 hover:text-primary-900';
      metaClass = 'text-gray-600';
    } else {
      // Frosted Glass theme
      cardClass = 'bg-white/25 border border-white/30 text-gray-900 dark:bg-black/20 dark:text-gray-100 dark:border-white/10 shadow-sm rounded-3xl p-6 backdrop-blur-md transition duration-200 hover:scale-[1.01] hover:shadow-md';
      titleClass = 'text-gray-900 font-bold group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400';
      contentClass = 'text-gray-600 dark:text-gray-300';
      tagClass = 'bg-white/40 text-gray-800 border border-white/20 dark:bg-black/40 dark:text-gray-200 dark:border-white/10';
      linkClass = 'text-primary-600 dark:text-primary-400 hover:underline';
      metaClass = 'text-gray-500 dark:text-gray-400';
    }
  } else {
    // Custom color themes (pastel)
    const colorConfigs = {
      green: {
        card: 'bg-emerald-50/75 border border-emerald-200 text-emerald-950 dark:bg-emerald-950/20 dark:border-emerald-800/40 dark:text-emerald-100 shadow-sm rounded-3xl p-6 backdrop-blur-md transition duration-200 hover:scale-[1.01] hover:shadow-md',
        title: 'text-emerald-950 font-bold group-hover:text-primary-700 dark:text-white',
        content: 'text-emerald-800/90 dark:text-emerald-200/90',
        tag: 'bg-emerald-100/50 text-emerald-800 border border-emerald-200/40 dark:bg-emerald-900/40 dark:text-emerald-200',
        link: 'text-emerald-700 hover:text-emerald-950 dark:text-emerald-400 dark:hover:text-emerald-200',
        meta: 'text-emerald-700/80 dark:text-emerald-400/80',
      },
      amber: {
        card: 'bg-amber-50/75 border border-amber-200 text-amber-950 dark:bg-amber-950/20 dark:border-amber-800/40 dark:text-amber-100 shadow-sm rounded-3xl p-6 backdrop-blur-md transition duration-200 hover:scale-[1.01] hover:shadow-md',
        title: 'text-amber-950 font-bold group-hover:text-primary-700 dark:text-white',
        content: 'text-amber-800/90 dark:text-amber-200/90',
        tag: 'bg-amber-100/50 text-amber-800 border border-amber-200/40 dark:bg-amber-900/40 dark:text-amber-200',
        link: 'text-amber-700 hover:text-amber-950 dark:text-amber-400 dark:hover:text-amber-200',
        meta: 'text-amber-700/80 dark:text-amber-400/80',
      },
      peach: {
        card: 'bg-orange-50/75 border border-orange-200 text-orange-950 dark:bg-orange-950/20 dark:border-orange-800/40 dark:text-orange-100 shadow-sm rounded-3xl p-6 backdrop-blur-md transition duration-200 hover:scale-[1.01] hover:shadow-md',
        title: 'text-orange-950 font-bold group-hover:text-primary-700 dark:text-white',
        content: 'text-orange-800/90 dark:text-orange-200/90',
        tag: 'bg-orange-100/50 text-orange-800 border border-orange-200/40 dark:bg-orange-900/40 dark:text-orange-200',
        link: 'text-orange-700 hover:text-orange-950 dark:text-orange-400 dark:hover:text-orange-200',
        meta: 'text-orange-700/80 dark:text-orange-400/80',
      },
      pink: {
        card: 'bg-rose-50/75 border border-rose-200 text-rose-950 dark:bg-rose-950/20 dark:border-rose-800/40 dark:text-rose-100 shadow-sm rounded-3xl p-6 backdrop-blur-md transition duration-200 hover:scale-[1.01] hover:shadow-md',
        title: 'text-rose-950 font-bold group-hover:text-primary-700 dark:text-white',
        content: 'text-rose-800/90 dark:text-rose-200/90',
        tag: 'bg-rose-100/50 text-rose-800 border border-rose-200/40 dark:bg-rose-900/40 dark:text-rose-200',
        link: 'text-rose-700 hover:text-rose-950 dark:text-rose-400 dark:hover:text-rose-200',
        meta: 'text-rose-700/80 dark:text-rose-400/80',
      },
      lavender: {
        card: 'bg-purple-50/75 border border-purple-200 text-purple-950 dark:bg-purple-950/20 dark:border-purple-800/40 dark:text-purple-100 shadow-sm rounded-3xl p-6 backdrop-blur-md transition duration-200 hover:scale-[1.01] hover:shadow-md',
        title: 'text-purple-950 font-bold group-hover:text-primary-700 dark:text-white',
        content: 'text-purple-800/90 dark:text-purple-200/90',
        tag: 'bg-purple-100/50 text-purple-800 border border-purple-200/40 dark:bg-purple-900/40 dark:text-purple-200',
        link: 'text-purple-700 hover:text-purple-950 dark:text-purple-400 dark:hover:text-purple-200',
        meta: 'text-purple-700/80 dark:text-purple-400/80',
      },
    };

    const config = colorConfigs[colorTheme];
    cardClass = config.card;
    titleClass = config.title;
    contentClass = config.content;
    tagClass = config.tag;
    linkClass = config.link;
    metaClass = config.meta;
  }

  const handlePinToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await noteService.update(note._id, { isPinned: !note.isPinned });
      toast.success(note.isPinned ? 'Note unpinned' : 'Note pinned');
      onUpdate?.();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <article
      className={`group flex flex-col relative ${cardClass} ${
        square ? 'aspect-square min-h-[300px] w-full' : ''
      }`}
    >
      {/* Pin toggle button inside note card */}
      <button
        type="button"
        onClick={handlePinToggle}
        className={`absolute top-4 right-4 p-1.5 rounded-full backdrop-blur-sm transition duration-150 z-10 ${
          note.isPinned
            ? 'bg-primary-500 text-white shadow-sm'
            : 'bg-white/20 text-gray-500 hover:bg-white/40 dark:text-gray-400 dark:hover:bg-black/35 opacity-0 group-hover:opacity-100 focus:opacity-100'
        }`}
        aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
      >
        <Pin className="h-4 w-4 transform rotate-45" />
      </button>

      <Link
        to={`/notes/${note._id}/edit`}
        className={square ? 'flex min-h-0 flex-1 flex-col' : 'block'}
      >
        <header className="flex items-start justify-between gap-6 pr-6">
          <h3 className={`line-clamp-2 text-base ${titleClass}`}>
            {note.title}
          </h3>
          <span className="flex shrink-0 items-center gap-1">
            {note.isUnread && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white animate-pulse">
                New
              </span>
            )}
            {note.isArchived && <Archive className="h-4 w-4 text-amber-500" />}
          </span>
        </header>
        {note.sharedBy && (
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
            <Share2 className="h-3 w-3 shrink-0" />
            Shared by {note.sharedBy}
          </p>
        )}
        
        {/* Strip markdown tags for preview */}
        <p
          className={`mt-2 text-sm ${contentClass} ${
            square ? 'line-clamp-5 flex-1' : 'line-clamp-2'
          }`}
        >
          {stripMarkdown(note.content)}
        </p>

        {note.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tagClass}`}
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
        <footer className={`mt-4 flex items-center justify-between text-xs ${metaClass}`}>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatRelative(note.updatedAt)}
          </span>
        </footer>
      </Link>
      <Link
        to={`/notes/${note._id}/history`}
        className={`mt-3 flex items-center gap-1 text-xs font-medium ${linkClass}`}
      >
        <History className="h-3.5 w-3.5" />
        Version history
      </Link>
    </article>
  );
};
