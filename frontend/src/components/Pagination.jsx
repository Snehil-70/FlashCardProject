export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const getPages = () => {
    const nums = [];
    const delta = 2;
    const left = Math.max(1, page - delta);
    const right = Math.min(pages, page + delta);

    if (left > 1) { nums.push(1); if (left > 2) nums.push('...'); }
    for (let i = left; i <= right; i++) nums.push(i);
    if (right < pages) { if (right < pages - 1) nums.push('...'); nums.push(pages); }
    return nums;
  };

  const btnStyle = (active = false, disabled = false) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
    height: 36,
    padding: '0 10px',
    border: '1px solid',
    borderColor: active ? 'var(--accent)' : 'var(--border)',
    borderRadius: 8,
    background: active ? 'var(--accent)' : 'transparent',
    color: active ? '#fff' : disabled ? 'var(--text-dim)' : 'var(--text-muted)',
    fontSize: '0.85rem',
    fontWeight: active ? 700 : 400,
    cursor: disabled ? 'default' : 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: "'Space Grotesk', sans-serif",
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '32px 0' }}>
      <button
        style={btnStyle(false, page === 1)}
        onClick={() => page > 1 && onPageChange(page - 1)}
        disabled={page === 1}
      >
        ← Prev
      </button>

      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`dot-${i}`} style={{ color: 'var(--text-dim)', padding: '0 4px' }}>…</span>
        ) : (
          <button
            key={p}
            style={btnStyle(p === page)}
            onClick={() => onPageChange(p)}
            onMouseEnter={e => { if (p !== page) { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text)'; }}}
            onMouseLeave={e => { if (p !== page) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}}
          >
            {p}
          </button>
        )
      )}

      <button
        style={btnStyle(false, page === pages)}
        onClick={() => page < pages && onPageChange(page + 1)}
        disabled={page === pages}
      >
        Next →
      </button>
    </div>
  );
}
