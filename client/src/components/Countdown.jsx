import { useEffect, useState } from 'react';

function diff(targetMs) {
  const total = targetMs - Date.now();
  if (total <= 0) return null;
  const seconds = Math.floor(total / 1000) % 60;
  const minutes = Math.floor(total / (1000 * 60)) % 60;
  const hours = Math.floor(total / (1000 * 60 * 60)) % 24;
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds };
}

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function Countdown({ date, startTime, label = 'Starts in' }) {
  const target = (() => {
    if (!date) return null;
    const base = new Date(date);
    if (Number.isNaN(base.getTime())) return null;
    if (startTime && /^\d{1,2}:\d{2}/.test(startTime)) {
      const [h, m] = startTime.split(':').map(Number);
      base.setHours(h || 0, m || 0, 0, 0);
    }
    return base.getTime();
  })();

  const [time, setTime] = useState(() => (target ? diff(target) : null));

  useEffect(() => {
    if (!target) return;
    setTime(diff(target));
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!target) return null;

  if (!time) {
    return (
      <div className="countdown countdown-live">
        <span className="countdown-live-dot" aria-hidden="true" />
        <span className="countdown-live-text">Happening now</span>
      </div>
    );
  }

  return (
    <div className="countdown" aria-label={`${label} ${time.days} days ${time.hours} hours`}>
      <span className="countdown-label">{label}</span>
      <div className="countdown-grid">
        <div className="countdown-cell">
          <strong>{time.days}</strong>
          <span>Days</span>
        </div>
        <div className="countdown-cell">
          <strong>{pad(time.hours)}</strong>
          <span>Hours</span>
        </div>
        <div className="countdown-cell">
          <strong>{pad(time.minutes)}</strong>
          <span>Minutes</span>
        </div>
        <div className="countdown-cell">
          <strong>{pad(time.seconds)}</strong>
          <span>Seconds</span>
        </div>
      </div>
    </div>
  );
}