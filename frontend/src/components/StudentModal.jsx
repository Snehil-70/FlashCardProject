import { useState, useEffect, useRef } from 'react';
import api from '../utils/api.js';
import toast from 'react-hot-toast';

const initialForm = {
  name: '',
  course: '',
  year: 1,
  city: '',
  email: '',
  phone: '',
  bio: '',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#8888aa',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
};

export default function StudentModal({ student, onClose, onSaved }) {
  const [form, setForm] = useState(student ? {
    name: student.name || '',
    course: student.course || '',
    year: student.year || 1,
    city: student.city || '',
    email: student.email || '',
    phone: student.phone || '',
    bio: student.bio || '',
  } : initialForm);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(student?.image || '');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      let data;
      if (student) {
        const res = await api.put(`/students/${student._id}`, fd);
        data = res.data;
        toast.success('Student updated!');
      } else {
        const res = await api.post('/students', fd);
        data = res.data;
        toast.success('Student added!');
      }
      onSaved(data.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: 560,
        maxHeight: '90vh',
        overflowY: 'auto',
        animation: 'slideIn 0.25s ease both',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.2rem' }}>
            {student ? '✏️ Edit Student' : '➕ Add Student'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              color: 'var(--text-muted)',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Image upload */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: imagePreview ? 'transparent' : 'var(--bg-2)',
                border: '2px dashed var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                flexShrink: 0,
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              {imagePreview
                ? <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '1.5rem' }}>📷</span>
              }
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                Profile Photo
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                JPG, PNG, WEBP · max 5MB
              </p>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => fileRef.current?.click()}
                style={{ marginTop: 8, fontSize: '0.78rem', padding: '6px 14px' }}
              >
                Upload
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
          </div>

          {/* Name + Course */}
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input className="input" name="name" value={form.name} onChange={handleChange} required placeholder="Sanjeev Maurya" />
            </div>
            <div>
              <label style={labelStyle}>Course *</label>
              <input className="input" name="course" value={form.course} onChange={handleChange} required placeholder="B.Tech" />
            </div>
          </div>

          {/* Year + City */}
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>Year *</label>
              <select className="input" name="year" value={form.year} onChange={handleChange} required
                style={{ background: 'var(--bg-2)', cursor: 'pointer' }}>
                {[1,2,3,4,5,6].map(y => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>City *</label>
              <input className="input" name="city" value={form.city} onChange={handleChange} required placeholder="Agra" />
            </div>
          </div>

          {/* Email + Phone */}
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>Email *</label>
              <input className="input" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="student@example.com" />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input className="input" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" maxLength={10} />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label style={labelStyle}>Bio</label>
            <textarea
              className="input"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Brief description..."
              rows={3}
              maxLength={300}
              style={{ resize: 'vertical', minHeight: 80 }}
            />
            <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 4, textAlign: 'right' }}>
              {form.bio.length}/300
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Saving...
                </span>
              ) : (student ? 'Update Student' : 'Add Student')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
