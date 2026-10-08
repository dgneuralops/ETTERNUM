import { createPortal } from 'react-dom';

// Renders fixed-position layers (modals, toasts) into the app root instead of inside the
// animated page wrapper, whose transform would otherwise become their containing block.
export function Overlay({ children }) {
  const host = document.getElementById('ett-app') || document.body;
  return createPortal(children, host);
}
