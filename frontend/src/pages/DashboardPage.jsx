import { useCallback, useEffect, useState } from 'react';
import { Link, useOutletContext, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { noteService } from '../services/note.service.js';
import { Header } from '../components/layout/Header.jsx';
import { NoteCard } from '../components/notes/NoteCard.jsx';
import { NoteListSkeleton } from '../components/ui/Skeleton.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { ErrorState } from '../components/common/ErrorState.jsx';
import { Pagination } from '../components/common/Pagination.jsx';
import { Button } from '../components/ui/Button.jsx';
import { toast } from 'react-toastify';
import { unwrapApiData } from '../utils/note.js';

const DashboardPage = () => {
  const { openSidebar } = useOutletContext() || {};

  const [searchParams, setSearchParams] = useSearchParams();
  const archived = searchParams.get('archived') === 'true';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const tag = searchParams.get('tag') || '';

  const [notes, setNotes] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await noteService.getAll({
        page,
        limit: 12,
        archived,
        tag: tag || undefined,
      });
      const payload = unwrapApiData(response);
      setNotes(Array.isArray(payload) ? payload : payload.data || []);
      setMeta(Array.isArray(payload) ? null : payload.meta || null);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, archived, tag]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
  };

  const pinnedNotes = notes.filter((n) => n.isPinned);
  const otherNotes = notes.filter((n) => !n.isPinned);

  return (
    <section className="flex flex-1 flex-col overflow-hidden">
      <Header
        title={archived ? 'Archived Notes' : 'My Notes'}
        subtitle={`${meta?.total ?? 0} notes`}
        onMenuClick={openSidebar}
        actions={
          <Link to="/notes/new">
            <Button>
              <Plus className="h-4 w-4" />
              New Note
            </Button>
          </Link>
        }
      />

      <section className="flex-1 overflow-y-auto p-4 lg:p-8">
        {/* Active Tag Filter Indicator */}
        {tag && (
          <div className="mb-6 flex items-center justify-between bg-white/25 border border-white/35 px-5 py-2.5 rounded-full backdrop-blur-md dark:bg-black/20 dark:border-white/10 shadow-sm animate-slide-in">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtering notes by tag: <span className="font-bold text-primary-600 dark:text-primary-400">#{tag}</span>
            </span>
            <button
              type="button"
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.delete('tag');
                params.set('page', '1');
                setSearchParams(params);
              }}
              className="text-xs font-bold text-red-500 hover:text-red-700 dark:text-rose-400 dark:hover:text-rose-300"
            >
              Clear Filter
            </button>
          </div>
        )}

        {loading && <NoteListSkeleton count={6} square />}
        {error && !loading && <ErrorState message={error} onRetry={fetchNotes} />}
        {!loading && !error && notes.length === 0 && (
          <EmptyState
            title={archived ? 'No archived notes' : 'No notes yet'}
            description="Create your first note to get started"
            actionLabel="Create Note"
            actionTo="/notes/new"
          />
        )}
        {!loading && !error && notes.length > 0 && (
          <>
            {/* Pinned Section */}
            {pinnedNotes.length > 0 && (
              <div className="mb-8 space-y-3">
                <h4 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                  Pinned ({pinnedNotes.length})
                </h4>
                <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {pinnedNotes.map((note, index) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      index={index}
                      square
                      onUpdate={fetchNotes}
                    />
                  ))}
                </section>
              </div>
            )}

            {/* Others Section */}
            <div className="space-y-3">
              {pinnedNotes.length > 0 && otherNotes.length > 0 && (
                <h4 className="text-xs font-bold tracking-wider text-gray-400 uppercase pt-2">
                  Others ({otherNotes.length})
                </h4>
              )}
              {otherNotes.length > 0 ? (
                <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {otherNotes.map((note, index) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      index={index + pinnedNotes.length}
                      square
                      onUpdate={fetchNotes}
                    />
                  ))}
                </section>
              ) : (
                pinnedNotes.length === 0 && (
                  <p className="text-gray-400 italic">No notes found.</p>
                )
              )}
            </div>

            <section className="mt-8">
              <Pagination meta={meta} onPageChange={handlePageChange} />
            </section>
          </>
        )}
      </section>
    </section>
  );
};

export default DashboardPage;
