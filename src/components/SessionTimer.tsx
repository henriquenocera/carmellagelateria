import { useEffect, useState, useCallback } from 'react';
import { Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export function SessionTimer() {
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_MS);
  const { signOut } = useAuth();

  const handleIdleTimeout = useCallback(async () => {
    await signOut();
    window.location.reload();
  }, [signOut]);

  // Use debounce or throttling in a larger app, but simple reset works fine here.
  const resetTimer = useCallback(() => {
    setTimeLeft(TIMEOUT_MS);
  }, []);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    // We only attach to the document body to reset the timer 
    // when any actual user interaction happens.
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach(event => document.addEventListener(event, handleActivity));

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(intervalId);
          handleIdleTimeout();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => {
      events.forEach(event => document.removeEventListener(event, handleActivity));
      clearInterval(intervalId);
    };
  }, [handleIdleTimeout, resetTimer]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const isWarning = timeLeft <= 60000; // less than 1 minute

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: isWarning ? '#ef4444' : '#64748b',
        fontSize: '13px',
        fontWeight: '500',
        background: isWarning ? '#fef2f2' : '#f8fafc',
        padding: '4px 10px',
        borderRadius: '12px',
        border: isWarning ? '1px solid #fecaca' : '1px solid transparent',
        transition: 'all 0.3s'
      }}
    >
      <Clock size={16} />
      <span>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
    </div>
  );
}
