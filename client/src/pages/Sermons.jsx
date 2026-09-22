import { useEffect, useRef, useState } from 'react';
import api, { resolveMediaUrl } from '../services/api';

function formatDuration(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return '—';
  const s = Math.floor(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default function Sermons() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const audioRefs = useRef(new Map());
  const [durations, setDurations] = useState({});

  useEffect(() => {
    api.get('/sermons').then((r) => {
      const normalized = r.data.map((s) => ({
        ...s,
        audioUrl: resolveMediaUrl(s.audioUrl),
        videoUrl: resolveMediaUrl(s.videoUrl),
        thumbnail: resolveMediaUrl(s.thumbnail)
      }));
      setItems(normalized);
    });
  }, []);

  const filtered = items.filter((s) =>
    [s.title, s.speaker, s.scripture]
      .join(' ')
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  const handlePlay = (id) => {
    audioRefs.current.forEach((audio, key) => {
      if (key !== id && audio && !audio.paused) {
        audio.pause();
      }
    });
  };

  const handleLoadedMetadata = (id, el) => {
    if (!el) return;
    const d = el.duration;
    if (!Number.isFinite(d) || d <= 0) return;
    setDurations((prev) => {
      if (prev[id] === d) return prev;
      return { ...prev, [id]: d };
    });
  };

  const handleError = (id, url, error) => {
    console.error('Audio failed to load:', url, '→', error);
    setDurations((prev) => {
      if (prev[id] === 'error') return prev;
      return { ...prev, [id]: 'error' };
    });
  };

  return (
    <div className="section container">
      <h1>Sermons</h1>

      <input
        className="input"
        placeholder="Search by title, speaker, or scripture…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="grid">
        {filtered.map((s) => {
          const dur = durations[s._id];
          return (
            <div className="card" key={s._id}>
              {s.thumbnail && <img src={s.thumbnail} alt={s.title} />}
              <h3>{s.title}</h3>
              <p>
                <strong>{s.speaker}</strong> · {s.scripture}
              </p>
              {s.sermonDate && (
                <p className="muted">
                  {new Date(s.sermonDate).toLocaleDateString()}
                </p>
              )}
              {s.description && <p>{s.description}</p>}

              {s.youtubeUrl && (
                <a
                  className="btn-secondary sermon-action"
                  href={s.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch on YouTube
                </a>
              )}

              {s.audioUrl && (
                <div className="sermon-audio">
                  <audio
                    controls
                    preload="metadata"
                    ref={(el) => {
                      if (el) audioRefs.current.set(s._id, el);
                      else audioRefs.current.delete(s._id);
                    }}
                    onPlay={() => handlePlay(s._id)}
                    onLoadedMetadata={(e) =>
                      handleLoadedMetadata(s._id, e.currentTarget)
                    }
                    onError={(e) =>
                      handleError(s._id, s.audioUrl, e.currentTarget.error)
                    }
                    src={s.audioUrl}
                  />

                  <p className="sermon-duration">
                    <strong>Duration:</strong>{' '}
                    {dur === 'error' ? (
                      <span className="error">
                        Could not load audio{' '}
                        <a
                          href={s.audioUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          (open file)
                        </a>
                      </span>
                    ) : dur ? (
                      formatDuration(dur)
                    ) : (
                      <span className="muted">Loading…</span>
                    )}
                  </p>

                  <a
                    className="btn-secondary sermon-action"
                    href={s.audioUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download Audio
                  </a>
                </div>
              )}

              {s.videoUrl && (
                <a
                  className="btn-secondary sermon-action"
                  href={s.videoUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                >
                  Download Video
                </a>
              )}
            </div>
          );
        })}

        {!filtered.length && (
          <p className="muted">
            No sermons have been published yet. Please check back soon.
          </p>
        )}
      </div>
    </div>
  );
}