import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { Icon } from '../components/Icon';

type ToastTone = 'success' | 'error' | 'warning' | 'info';
interface ToastItem { id: number; tone: ToastTone; title: string; description?: string }

interface ToastApi {
  show: (tone: ToastTone, title: string, description?: string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

const ToastCtx = createContext<ToastApi | null>(null);

const ICON: Record<ToastTone, string> = {
  success: 'bi-check-circle-fill', error: 'bi-x-octagon-fill', warning: 'bi-exclamation-triangle-fill', info: 'bi-info-circle-fill',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(0);

  const remove = useCallback((id: number) => setItems((xs) => xs.filter((x) => x.id !== id)), []);

  const show = useCallback(
    (tone: ToastTone, title: string, description?: string) => {
      const id = ++seq.current;
      setItems((xs) => [...xs.slice(-3), { id, tone, title, description }]);
      setTimeout(() => remove(id), tone === 'error' ? 7000 : 4500);
    },
    [remove],
  );

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (t, d) => show('success', t, d),
      error: (t, d) => show('error', t, d),
      info: (t, d) => show('info', t, d),
      warning: (t, d) => show('warning', t, d),
    }),
    [show],
  );

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="app-toasts" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`ir-toast tone-${t.tone}`} role={t.tone === 'error' ? 'alert' : 'status'}>
            <Icon name={ICON[t.tone]} className="ir-toast-icon" size={18} />
            <div className="ir-toast-body">
              <div className="ir-toast-title">{t.title}</div>
              {t.description && <div className="ir-toast-desc">{t.description}</div>}
            </div>
            <button type="button" className="ir-iconbtn ir-iconbtn-ghost ir-iconbtn-sm" aria-label="Đóng thông báo" onClick={() => remove(t.id)}>
              <Icon name="bi-x-lg" />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast phải dùng bên trong ToastProvider');
  return ctx;
}
