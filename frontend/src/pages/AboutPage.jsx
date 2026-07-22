import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Notebook, ArrowLeft } from 'lucide-react';

import { aboutService } from '../services/about.service.js';
import { useTheme } from '../context/ThemeContext.jsx';

const AboutPage = () => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    aboutService
      .getAbout()
      .then((res) => setInfo(res.data))
      .catch(() =>
        setInfo({
          name: 'Notes App',
          email: 'support@example.com',
          'my features': {},
        }),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-screen pastel-mesh-bg">
      <header className="border-b border-white/20 bg-white/10 px-6 py-4 backdrop-blur-md dark:border-white/10 dark:bg-black/15">
        <nav className="mx-auto flex max-w-4xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-black tracking-tight text-primary-600 dark:text-primary-400">
            <Notebook className="h-6 w-6" />
            Notes
          </Link>


          <section className="flex items-center gap-4">
            <button type="button" onClick={toggleTheme} className="text-sm font-semibold text-gray-700 hover:text-gray-950 dark:text-gray-300 dark:hover:text-white">
              {darkMode ? 'Light' : 'Dark'} mode
            </button>
            <Link to="/" className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </section>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16 relative">
        {/* Ambient background glows for glassmorphism */}
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-gradient-to-br from-[#a3e635]/20 to-cyan-400/20 blur-[100px] pointer-events-none" />
        <div className="absolute left-0 bottom-10 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-500/15 to-purple-500/15 blur-[100px] pointer-events-none" />

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        ) : (
          <article className="relative z-10 border border-white/30 bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl dark:border-white/10 dark:bg-black/20">
            <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">About Notes App</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 font-medium">A visual note-taking application designed for ultimate productivity.</p>

            <section className="mt-10 space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Key Features</h2>
              
              <section className="rounded-2xl bg-white/20 p-5 dark:bg-black/30 border border-white/20 dark:border-white/5 backdrop-blur-md">
                <h3 className="font-semibold text-gray-900 dark:text-white">Visual Rich-Text Editing</h3>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Format notes instantly with bold, italics, checklists, and code styling using built-in editor controls.</p>
              </section>

              <section className="rounded-2xl bg-white/20 p-5 dark:bg-black/30 border border-white/20 dark:border-white/5 backdrop-blur-md">
                <h3 className="font-semibold text-gray-900 dark:text-white">Fast Keyboard Shortcuts</h3>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Maximize note productivity using inline key combinations like Ctrl+B (Bold), Ctrl+I (Italic), and Ctrl+Shift+8 (Bulleted List).</p>
              </section>

              <section className="rounded-2xl bg-white/20 p-5 dark:bg-black/30 border border-white/20 dark:border-white/5 backdrop-blur-md">
                <h3 className="font-semibold text-gray-900 dark:text-white">Custom Pastel Color Themes</h3>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Organize and distinguish notes visually on your dashboard using a curated palette of custom color themes.</p>
              </section>

              <section className="rounded-2xl bg-white/20 p-5 dark:bg-black/30 border border-white/20 dark:border-white/5 backdrop-blur-md">
                <h3 className="font-semibold text-gray-900 dark:text-white">Version History & Snapshot Restores</h3>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Track modifications across saving cycles and restore previous versions of notes easily in one click.</p>
              </section>

              <section className="rounded-2xl bg-white/20 p-5 dark:bg-black/30 border border-white/20 dark:border-white/5 backdrop-blur-md">
                <h3 className="font-semibold text-gray-900 dark:text-white">Secure Sharing & Collaboration</h3>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Collaborate in real-time by sharing notes securely with other registered users.</p>
              </section>
            </section>

            <footer className="mt-12 pt-6 border-t border-white/20 dark:border-white/10 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
              <span>Developed by <span className="font-semibold text-gray-800 dark:text-gray-200">{info?.name || 'Notes App Team'}</span></span>
              <span><a href={`mailto:${info?.email || 'support@example.com'}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition">{info?.email || 'support@example.com'}</a></span>
            </footer>
          </article>
        )}
      </main>
    </section>
  );
};

export default AboutPage;
