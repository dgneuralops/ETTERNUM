import { useEffect, useRef, useState } from 'react';
import { ETT } from '../data.js';

// Image frame used for portraits and admin uploads.
// - `mind-<slug>` ids resolve to the bundled portrait for that mind.
// - Any other id is an upload slot: click or drop an image (downscaled to a JPEG data URL).
//   Controlled when `onChange` is given (`src` is the current image); otherwise the image is
//   kept in localStorage under the slot id.
const KEY = 'ett-slot:';
const MAX_W = 900;

const read = id => { try { return localStorage.getItem(KEY + id) || ''; } catch { return ''; } };
const write = (id, url) => { try { url ? localStorage.setItem(KEY + id, url) : localStorage.removeItem(KEY + id); } catch { /* storage full or blocked */ } };

function shrink(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_W / img.naturalWidth);
      const c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * scale);
      c.height = Math.round(img.naturalHeight * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL('image/jpeg', 0.86));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function ImageSlot({ id, shape = 'rounded', radius, placeholder = 'Arraste uma imagem', compact, src, onChange }) {
  const fixed = ETT.photo(id);
  const controlled = !fixed && !!onChange;
  const [stored, setStored] = useState(() => (fixed || controlled ? '' : read(id)));
  const [over, setOver] = useState(false);
  const input = useRef(null);
  useEffect(() => { if (!fixed && !controlled) setStored(read(id)); }, [id, fixed, controlled]);

  const url = fixed || (controlled ? src : stored || src);
  const r = shape === 'circle' ? '50%' : shape === 'pill' ? '9999px' : shape === 'rect' ? '0' : (Number.isFinite(+radius) && radius !== undefined ? +radius : 12) + 'px';
  const editable = !fixed;

  const take = async file => {
    if (!file || !file.type.startsWith('image/')) return;
    const data = await shrink(file);
    if (controlled) return onChange(data);
    write(id, data);
    setStored(data);
  };

  const box = { position: 'relative', display: 'block', width: '100%', height: '100%', aspectRatio: '3/2', font: '13px/1.3 system-ui,-apple-system,sans-serif' };
  const frame = { position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: r, background: 'rgba(127,127,127,.08)', outline: over ? '2px solid #E0C78E' : 'none', outlineOffset: -2 };

  if (url) {
    return (
      <span style={box}>
        <span style={frame}><img src={url} alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /></span>
        {editable && (
          <button type="button" onClick={() => { if (controlled) return onChange(''); write(id, ''); setStored(''); }} style={{ position: 'absolute', top: 8, right: 8, height: 28, padding: '0 10px', border: 0, borderRadius: 8, background: 'rgba(11,11,12,.7)', color: '#F3EFE6', font: '600 12px Urbanist', cursor: 'pointer' }}>Remover</button>
        )}
      </span>
    );
  }

  return (
    <span
      style={{ ...box, cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      aria-label={placeholder}
      onClick={() => input.current && input.current.click()}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.current && input.current.click(); } }}
      onDragOver={e => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={e => { e.preventDefault(); setOver(false); take(e.dataTransfer.files[0]); }}
    >
      <span style={frame}></span>
      <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: r, border: `1.5px dashed ${over ? '#E0C78E' : 'currentColor'}`, opacity: over ? 1 : 0.35 }}></span>
      <span style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: compact ? 0 : 6, textAlign: 'center', padding: compact ? 2 : 12, userSelect: 'none' }}>
        {!compact && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.45 }}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" /></svg>
        )}
        <span style={compact ? { fontWeight: 600, fontSize: 11, lineHeight: 1, letterSpacing: '.04em', opacity: 0.85 } : { maxWidth: '90%', fontWeight: 500, letterSpacing: '.01em', opacity: 0.75 }}>{placeholder}</span>
        {!compact && <span style={{ fontSize: 11, opacity: 0.75 }}>Arraste ou <u style={{ textUnderlineOffset: 2 }}>escolha um arquivo</u></span>}
      </span>
      <input ref={input} type="file" accept="image/*" hidden onChange={e => { take(e.target.files[0]); e.target.value = ''; }} />
    </span>
  );
}
