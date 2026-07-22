import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Archive,
  Notebook,
  Info,
  LayoutDashboard,
  LogOut,
  Moon,
  Plus,
  Search,
  Share2,
  Sun,
  Tag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSharedNotes } from '../../context/SharedNotesContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { noteService } from '../../services/note.service.js';
import { unwrapApiData } from '../../utils/note.js';

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
    isActive
      ? 'bg-white text-gray-900 shadow-sm border border-white/20 dark:bg-gray-800 dark:text-white dark:border-white/10'
      : 'text-gray-700 hover:bg-white/10 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-black/20 dark:hover:text-white'
  }`;

export const Sidebar = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { unreadCount } = useSharedNotes();
  const location = useLocation();
  const [tags, setTags] = useState([]);

  const isArchivedView =
    location.pathname === '/' && new URLSearchParams(location.search).get('archived') === 'true';
  const isDashboardView = location.pathname === '/' && !isArchivedView && !new URLSearchParams(location.search).get('tag');

  const handleNav = () => onNavigate?.();

  useEffect(() => {
    const fetchTags = async () => {
      if (!user) return;
      try {
        const response = await noteService.getAll({ limit: 100 });
        const payload = unwrapApiData(response);
        const notesList = Array.isArray(payload) ? payload : payload.data || [];
        const allTags = notesList.reduce((acc, note) => {
          if (note.tags) {
            note.tags.forEach((tag) => {
              if (tag && !acc.includes(tag)) acc.push(tag);
            });
          }
          return acc;
        }, []);
        setTags(allTags);
      } catch (err) {
        console.error('Failed to fetch tags for sidebar:', err);
      }
    };

    fetchTags();
  }, [user, location.pathname, location.search]);

  return (
    <aside className="flex h-full w-64 flex-col app-shell-border-r bg-white/20 dark:bg-black/20 backdrop-blur-xl">
      <header className="flex h-[5.5rem] shrink-0 items-center gap-2 px-5 border-b border-white/10">
        <Notebook className="h-7 w-7 shrink-0 text-primary-600 dark:text-primary-400" />
        <span className="text-lg font-black tracking-tight text-gray-900 dark:text-white">Notes</span>
      </header>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <Link to="/" className={navLinkClass({ isActive: isDashboardView })} onClick={handleNav}>
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>
        <NavLink to="/notes/new" className={navLinkClass} onClick={handleNav}>
          <Plus className="h-5 w-5" />
          New Note
        </NavLink>
        <NavLink to="/shared" className={navLinkClass} onClick={handleNav}>
          <Share2 className="h-5 w-5 shrink-0" />
          <span className="min-w-0 flex-1">Shared Notes</span>
          {unreadCount > 0 && (
            <span
              className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white"
              aria-label={`${unreadCount} new shared notes`}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </NavLink>
        <NavLink to="/search" className={navLinkClass} onClick={handleNav}>
          <Search className="h-5 w-5" />
          Search
        </NavLink>
        <Link
          to={{ pathname: '/', search: '?archived=true' }}
          className={navLinkClass({ isActive: isArchivedView })}
          onClick={handleNav}
        >
          <Archive className="h-5 w-5" />
          Archived
        </Link>
        <NavLink to="/about" className={navLinkClass} onClick={handleNav}>
          <Info className="h-5 w-5" />
          About
        </NavLink>

        {/* Sidebar Tags List */}
        {tags.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/10 space-y-1">
            <h5 className="px-4 text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Tags</h5>
            {tags.map((tag) => {
              const isTagActive = new URLSearchParams(location.search).get('tag') === tag;
              return (
                <Link
                  key={tag}
                  to={{ pathname: '/', search: `?tag=${encodeURIComponent(tag)}` }}
                  className={`flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isTagActive
                      ? 'bg-white text-gray-900 shadow-sm border border-white/20 dark:bg-gray-800 dark:text-white dark:border-white/10'
                      : 'text-gray-700 hover:bg-white/10 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-black/20 dark:hover:text-white'
                  }`}
                  onClick={handleNav}
                >
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{tag}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      <footer className="border-t border-white/10 p-4">
        <p className="mb-3 truncate px-3 text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
        <button
          type="button"
          onClick={toggleTheme}
          className="mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </footer>
    </aside>
  );
};
