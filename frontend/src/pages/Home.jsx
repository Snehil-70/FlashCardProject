import { useState, useEffect, useRef } from 'react';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import StudentCard from '../components/StudentCard.jsx';
import StudentModal from '../components/StudentModal.jsx';
import Pagination from '../components/Pagination.jsx';
import toast from 'react-hot-toast';

const LIMIT = 9;

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: `${color}18`,
        border: `1px solid ${color}33`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.4rem',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.6rem', color: color, lineHeight: 1 }}>
          {value ?? '—'}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [course, setCourse] = useState('');
  const [city, setCity] = useState('');
  const [year, setYear] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const debounceRef = useRef(null);
  // Tracks whether a filter change just reset page to 1 so we don't double-fetch
  const filterChangedRef = useRef(false);

  const fetchStudents = async (overridePage) => {
    setLoading(true);
    try {
      const p = overridePage ?? page;
      const query = new URLSearchParams({ page: p, limit: LIMIT, sort });
      if (search) query.set('search', search);
      if (course) query.set('course', course);
      if (city)   query.set('city', city);
      if (year)   query.set('year', year);
      const { data } = await api.get(`/students?${query}`);
      setStudents(data.data);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/students/stats');
      setStats(data.data);
    } catch {}
  };

  // Initial stats load
  useEffect(() => { fetchStats(); }, []);

  // Debounce filter/sort changes — reset to page 1 and fetch
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      filterChangedRef.current = true; // signal that we're already fetching
      setPage(1);
      fetchStudents(1);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, course, city, year, sort]);

  // Page change — only fetch if it wasn't triggered by a filter reset
  useEffect(() => {
    if (filterChangedRef.current) {
      filterChangedRef.current = false;
      return;
    }
    fetchStudents(page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/students/${id}`);
      toast.success('Student deleted');
      fetchStudents(page);
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleSaved = () => {
    // Mark as filter-changed so the page useEffect doesn't double-fetch
    filterChangedRef.current = true;
    setPage(1);
    fetchStudents(1);
    fetchStats();
  };

  const openAdd = () => { setEditStudent(null); setModalOpen(true); };
  const openEdit = (s) => { setEditStudent(s); setModalOpen(true); };

  const inputStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    color: 'var(--text)',
    fontSize: '0.875rem',
    padding: '10px 14px',
    fontFamily: "'Space Grotesk', sans-serif",
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <main style={{ minHeight: 'calc(100vh - 64px)', padding: '40px 0 60px' }}>
      <div className="container">

        {/* Header */}
        <div style={{ marginBottom: 36, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              background: 'linear-gradient(135deg, #f0f0f8, #8888aa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1,
              marginBottom: 8,
            }}>
              Student Flashcards
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Manage your student directory with ease
            </p>
          </div>
          {user && (
            <button className="btn btn-primary" onClick={openAdd} style={{ fontSize: '0.9rem' }}>
              ➕ Add Student
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          <StatCard label="Total Students" value={stats?.total} icon="🎓" color="#6c63ff" />
          <StatCard label="Courses" value={stats?.courses} icon="📚" color="#43e97b" />
          <StatCard label="Cities" value={stats?.cities} icon="🌆" color="#ff6584" />
        </div>

        {/* Search & Filters */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          marginBottom: 28,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
        }}>
          <input
            style={{ ...inputStyle, flex: '1 1 220px' }}
            placeholder="🔍 Search by name, course, city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <input
            style={{ ...inputStyle, flex: '1 1 130px' }}
            placeholder="Course"
            value={course}
            onChange={e => setCourse(e.target.value)}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <input
            style={{ ...inputStyle, flex: '1 1 130px' }}
            placeholder="City"
            value={city}
            onChange={e => setCity(e.target.value)}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <select
            style={{ ...inputStyle, flex: '1 1 100px', cursor: 'pointer' }}
            value={year}
            onChange={e => setYear(e.target.value)}
          >
            <option value="">All Years</option>
            {[1,2,3,4,5,6].map(y => <option key={y} value={y}>Year {y}</option>)}
          </select>
          <select
            style={{ ...inputStyle, flex: '1 1 150px', cursor: 'pointer' }}
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="name">Name A–Z</option>
            <option value="-name">Name Z–A</option>
            <option value="year">Year ↑</option>
            <option value="-year">Year ↓</option>
          </select>

          {(search || course || city || year) && (
            <button
              className="btn btn-ghost"
              onClick={() => { setSearch(''); setCourse(''); setCity(''); setYear(''); }}
              style={{ fontSize: '0.82rem', padding: '9px 14px' }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Results count */}
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>
          {loading ? 'Loading...' : `Showing ${students.length} of ${pagination.total} students`}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 20 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 340 }} />
            ))}
          </div>
        ) : students.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎓</div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.2rem', marginBottom: 8, color: 'var(--text)' }}>
              No students found
            </h3>
            <p style={{ fontSize: '0.9rem' }}>
              {search || course || city || year ? 'Try adjusting your filters' : 'Add your first student to get started'}
            </p>
            {user && !search && !course && !city && !year && (
              <button className="btn btn-primary" onClick={openAdd} style={{ marginTop: 20 }}>
                ➕ Add Student
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 20 }}>
            {students.map((s, i) => (
              <div key={s._id} style={{ animationDelay: `${i * 0.05}s` }}>
                <StudentCard student={s} onEdit={openEdit} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
      </div>

      {/* Modal */}
      {modalOpen && (
        <StudentModal
          student={editStudent}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </main>
  );
}
