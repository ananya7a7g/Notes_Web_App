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
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSharedNotes } from '../../context/SharedNotesContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { noteService } from '../../services/note.service.js';
import { unwrapApiData } from '../../utils/note.js';

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
    isActive
      ? 'bg-white text-gray-900 shadow-sm border border-white/20 dark:bg-gray-800 dark:text-white dark:border-white/10'
      : 'text-gray-700 hover:bg-white/15 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-black/20 dark:hover:text-white'
  }`;

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { unreadCount } = useSharedNotes();
  const location = useLocation();
  const [tags, setTags] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false);

  const isArchivedView =
    location.pathname === '/' && new URLSearchParams(location.search).get('archived') === 'true';
  const isDashboardView =
    location.pathname === '/' && !isArchivedView && !new URLSearchParams(location.search).get('tag');

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
        console.error('Failed to fetch tags for navbar:', err);
      }
    };

    fetchTags();
  }, [user, location.pathname, location.search]);

  return (
    <header className="sticky top-0 z-40 w-full app-shell-border-b bg-white/20 dark:bg-black/20 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5">
            <Notebook className="h-7 w-7 text-primary-600 dark:text-primary-400" />
            <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">Notes</span>
          </Link>



          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link to="/" className={navLinkClass({ isActive: isDashboardView })}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <NavLink to="/notes/new" className={navLinkClass}>
              <Plus className="h-4 w-4" />
              New Note
            </NavLink>
            <NavLink to="/shared" className={navLinkClass}>
              <Share2 className="h-4 w-4" />
              Shared
              {unreadCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </NavLink>
            <NavLink to="/search" className={navLinkClass}>
              <Search className="h-4 w-4" />
              Search
            </NavLink>
            <Link
              to={{ pathname: '/', search: '?archived=true' }}
              className={navLinkClass({ isActive: isArchivedView })}
            >
              <Archive className="h-4 w-4" />
              Archived
            </Link>
            <NavLink to="/about" className={navLinkClass}>
              <Info className="h-4 w-4" />
              About
            </NavLink>

            {/* Tags Dropdown */}
            {tags.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setTagsDropdownOpen(!tagsDropdownOpen)}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-white/15 dark:text-gray-300 dark:hover:bg-black/20"
                >
                  <Tag className="h-3.5 w-3.5 text-gray-500" />
                  Tags
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>

                {tagsDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setTagsDropdownOpen(false)}
                    />
                    <div className="absolute left-0 mt-2 z-20 w-48 rounded-2xl bg-white/90 p-2 shadow-xl backdrop-blur-xl border border-white/40 dark:bg-gray-900/90 dark:border-white/10 animate-slide-in">
                      {tags.map((tag) => (
                        <Link
                          key={tag}
                          to={{ pathname: '/', search: `?tag=${encodeURIComponent(tag)}` }}
                          onClick={() => setTagsDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <Tag className="h-3.5 w-3.5 text-gray-400" />
                          <span className="truncate">{tag}</span>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </nav>
        </div>

        {/* Right: Actions (Theme, User Profile, Logout, Mobile Toggle) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-white/20 dark:text-gray-300 dark:hover:bg-black/30 transition"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {user && (
            <div className="hidden sm:flex items-center gap-3 border-l border-white/20 pl-3 dark:border-white/10">
              <span className="max-w-[150px] truncate text-xs font-medium text-gray-600 dark:text-gray-300">
                {user.email}
              </span>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500/20 dark:text-rose-400 transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 md:hidden hover:bg-white/20 dark:text-gray-300"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-white/90 p-4 shadow-2xl backdrop-blur-2xl md:hidden dark:bg-gray-900/90 animate-slide-in">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              className={navLinkClass({ isActive: isDashboardView })}
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <NavLink
              to="/notes/new"
              className={navLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Plus className="h-4 w-4" />
              New Note
            </NavLink>
            <NavLink
              to="/shared"
              className={navLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Share2 className="h-4 w-4" />
              Shared Notes
            </NavLink>
            <NavLink
              to="/search"
              className={navLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search className="h-4 w-4" />
              Search
            </NavLink>
            <Link
              to={{ pathname: '/', search: '?archived=true' }}
              className={navLinkClass({ isActive: isArchivedView })}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Archive className="h-4 w-4" />
              Archived
            </Link>
            <NavLink
              to="/about"
              className={navLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Info className="h-4 w-4" />
              About
            </NavLink>

            {user && (
              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="mb-2 truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-xs font-bold text-red-600 dark:text-rose-400"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
