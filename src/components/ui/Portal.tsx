import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

export const Portal = ({ children }: PortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const portalRoot = document.getElementById('portal-root') || document.createElement('div');
  
  if (!document.getElementById('portal-root')) {
    portalRoot.id = 'portal-root';
    document.body.appendChild(portalRoot);
  }

  return createPortal(children, portalRoot);
};