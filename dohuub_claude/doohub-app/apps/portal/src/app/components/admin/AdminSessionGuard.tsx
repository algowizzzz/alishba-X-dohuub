import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../../../lib/supabase";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 min
const WARN_BEFORE_MS = 60 * 1000; // warn 60s before sign-out

/**
 * Signs the admin user out after a period of inactivity. Mounted once around
 * the protected admin route tree.
 */
export function AdminSessionGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warned = useRef(false);

  useEffect(() => {
    const reset = () => {
      warned.current = false;
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (warnTimer.current) clearTimeout(warnTimer.current);

      warnTimer.current = setTimeout(() => {
        warned.current = true;
        toast.warning("Session expiring soon. Move your mouse to stay signed in.", {
          duration: WARN_BEFORE_MS,
        });
      }, IDLE_TIMEOUT_MS - WARN_BEFORE_MS);

      idleTimer.current = setTimeout(async () => {
        try {
          await supabase.auth.signOut();
        } catch {}
        toast.error("Signed out due to inactivity");
        navigate("/admin/login", { replace: true });
      }, IDLE_TIMEOUT_MS);
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (warnTimer.current) clearTimeout(warnTimer.current);
    };
  }, [navigate]);

  return <>{children}</>;
}
