import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const yearColors = {
  1: { bg: 'rgba(67, 233, 123, 0.12)', color: '#43e97b' },
  2: { bg: 'rgba(108, 99, 255, 0.12)', color: '#6c63ff' },
  3: { bg: 'rgba(255, 101, 132, 0.12)', color: '#ff6584' },
  4: { bg: 'rgba(255, 193, 7, 0.12)', color: '#ffc107' },
  5: { bg: 'rgba(0, 188, 212, 0.12)', color: '#00bcd4' },
  6: { bg: 'rgba(156, 39, 176, 0.12)', color: '#9c27b0' },
};

export default function StudentCard({ student, onEdit, onDelete }) {
  const { user } = useAuth();
  const [imgError, setImgError] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const yr = yearColors[student.year] || yearColors[1];
  const initials = student.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${student.name}?`)) return;
    setDeleting(true);
    await onDelete(student._id);
    setDeleting(false);
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      transition: 'all 0.25s ease',
      animation: 'fadeIn 0.4s ease both',
      display: 'flex',
      flexDirection: 'column',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = 'var(--border-light)';
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      {/* Image / Avatar */}
      <div style={{
        height: 200,
        background: 'linear-gradient(135deg, #16161f 0%, #1c1c28 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {student.image && !imgError ? (
          <img
            src={student.image}
            alt={student.name}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: '1.8rem',
            color: '#fff',
          }}>
            {initials}
          </div>
        )}

        {/* Year badge overlay */}
        <div style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: yr.bg,
          color: yr.color,
          border: `1px solid ${yr.color}33`,
          borderRadius: 20,
          padding: '3px 10px',
          fontSize: '0.72rem',
          fontWeight: 700,
          backdropFilter: 'blur(8px)',
        }}>
          Year {student.year}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: '1.05rem',
            color: 'var(--text)',
            marginBottom: 4,
          }}>
            {student.name}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <span style={{
              background: 'rgba(108, 99, 255, 0.1)',
              color: 'var(--accent)',
              border: '1px solid rgba(108, 99, 255, 0.2)',
              borderRadius: 6,
              padding: '2px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}>
              {student.course}
            </span>
            <span style={{
              background: 'rgba(255,255,255,0.04)',
              color: 'var(--text-muted)',
              borderRadius: 6,
              padding: '2px 10px',
              fontSize: '0.75rem',
            }}>
              📍 {student.city}
            </span>
          </div>
        </div>

        {student.bio && (
          <p style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            lineHeight: 1.55,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {student.bio}
          </p>
        )}

        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>✉️ {student.email}</span>
          {student.phone && <span>📞 {student.phone}</span>}
        </div>

        {/* Actions */}
        {user && (
          <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 8 }}>
            <button
              className="btn btn-ghost"
              onClick={() => onEdit(student)}
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem', padding: '8px 12px' }}
            >
              ✏️ Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleting}
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem', padding: '8px 12px' }}
            >
              {deleting ? '...' : '🗑 Delete'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
