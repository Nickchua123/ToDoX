import React, { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile wrapper
 * Props:
 * - siteKey: string (required)
 * - onToken: (token: string|null) => void
 * - theme: 'auto' | 'light' | 'dark'
 * - size: 'normal' | 'compact'
 */
export default function Turnstile({ siteKey, onToken, theme = "auto", size = "normal" }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const waitTimerRef = useRef(null);

  useEffect(() => {
    const w = window;
    onToken?.(null);

    // Guard: need a site key and container
    if (!siteKey || !containerRef.current) {
      return () => {};
    }

    const renderWidget = () => {
      try {
        if (!w?.turnstile || !containerRef.current) return;
        // Remove previous widget if any
        if (widgetIdRef.current != null) {
          try { w.turnstile.remove(widgetIdRef.current); } catch {}
          widgetIdRef.current = null;
        }
        const id = w.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          size,
          callback: (token) => onToken?.(token || null),
          "error-callback": () => onToken?.(null),
          "expired-callback": () => onToken?.(null),
          retry: "auto",
        });
        widgetIdRef.current = id;
      } catch {}
    };

    // If script is loaded, use ready API
    if (w?.turnstile) {
      try {
        w.turnstile.ready(renderWidget);
      } catch {
        renderWidget();
      }
    } else {
      // Poll until script is available (handles async load in production builds)
      let attempts = 0;
      waitTimerRef.current = setInterval(() => {
        attempts += 1;
        if (w?.turnstile) {
          try {
            clearInterval(waitTimerRef.current);
          } catch {}
          waitTimerRef.current = null;
          try {
            w.turnstile.ready(renderWidget);
          } catch {
            renderWidget();
          }
        } else if (attempts > 60) { // ~15s at 250ms
          try { clearInterval(waitTimerRef.current); } catch {}
          waitTimerRef.current = null;
          // give up silently
        }
      }, 250);
    }

    return () => {
      if (waitTimerRef.current) {
        try { clearInterval(waitTimerRef.current); } catch {}
        waitTimerRef.current = null;
      }
      if (widgetIdRef.current != null) {
        try { w?.turnstile?.remove(widgetIdRef.current); } catch {}
        widgetIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey, theme, size]);

  return (
    <div className="cf-turnstile" ref={containerRef} />
  );
}
