import { useState, useEffect } from 'react';
import { Loader2, Server } from 'lucide-react';

export default function ColdStartBanner() {
  const [show, setShow] = useState(false);
  const [connected, setConnected] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already shown this session
    if (sessionStorage.getItem('coldStartShown') === 'connected') return;

    let timer = null;
    let cancelled = false;

    // Show banner if API doesn't respond in 3 seconds
    timer = setTimeout(() => {
      if (!cancelled) setShow(true);
    }, 3000);

    // Ping the API
    const checkApi = async () => {
      try {
        const baseURL = process.env.REACT_APP_API_URL || '/api';
        const res = await fetch(`${baseURL}/me`);
        if (res.ok && !cancelled) {
          clearTimeout(timer);
          setConnected(true);
          sessionStorage.setItem('coldStartShown', 'connected');
          // Auto-dismiss after showing "Connected!" briefly
          setTimeout(() => {
            if (!cancelled) setDismissed(true);
          }, 1500);
        }
      } catch {
        // API not ready yet — retry
        if (!cancelled) {
          setTimeout(checkApi, 2000);
        }
      }
    };

    checkApi();

    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  if (dismissed || (!show && !connected)) return null;
  if (!show && connected) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      connected ? 'translate-y-0' : 'translate-y-0'
    }`}>
      <div className={`px-4 py-3 text-center text-sm font-medium flex items-center justify-center gap-2 ${
        connected
          ? 'bg-green-500 text-white'
          : 'bg-amber-50 border-b border-amber-200 text-amber-800'
      }`}>
        {connected ? (
          <>
            <Server size={15} />
            Connected! Backend is ready.
          </>
        ) : (
          <>
            <Loader2 size={15} className="animate-spin" />
            Backend is waking up (free tier cold start). This takes ~30 seconds on first visit...
          </>
        )}
      </div>
    </div>
  );
}
