import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(10, 10, 15, 0.85)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid #2a2a3a',
  },
  inner: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 24px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: '1.3rem',
    color: '#f0f0f8',
    textDecoration: 'none',
  },
  logoIcon: {
    width: 34,
    height: 34,
    background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  userPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 14px',
    background: '#16161f',
    border: '1px solid #2a2a3a',
    borderRadius: 20,
    fontSize: '0.85rem',
    color: '#8888aa',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#43e97b',
  },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <div style={styles.logoIcon}>⚡</div>
          FlashCard
        </Link>

        <div style={styles.actions}>
          {user ? (
            <>
              <div style={styles.userPill}>
                <div style={styles.dot} />
                {user.name}
              </div>
              <button className="btn btn-ghost" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              {location.pathname !== '/login' && (
                <Link to="/login" className="btn btn-ghost">Login</Link>
              )}
              {location.pathname !== '/register' && (
                <Link to="/register" className="btn btn-primary">Register</Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
