import { useEffect, useRef, useState } from 'react';

const SLIDES = [
  '/hero/hero-01-preaching.jpg',
  '/hero/hero-02-choir.jpg',
  '/hero/hero-03-congregation.jpg',
  '/hero/hero-04-baptism.jpg',
  '/hero/hero-05-communion.jpg',
  '/hero/hero-06-worship.jpg',
  '/hero/hero-07-youth.jpg',
  '/hero/hero-08-children.jpg',
  '/hero/hero-09-outreach.jpg',
  '/hero/hero-10-fellowship.jpg'
];

const INTERVAL_MS = 5000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const goTo = (i) => setIndex(i);
  const next = () => setIndex((i) => (i + 1) % SLIDES.length);
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div
      className="hero-slider"
      aria-hidden="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((src, i) => (
        <div
          key={src}
          className={`hero-slide ${i === index ? 'active' : ''}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}

      <div className="hero-slider-overlay" />

      <button
        type="button"
        className="hero-arrow hero-arrow-prev"
        onClick={prev}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        type="button"
        className="hero-arrow hero-arrow-next"
        onClick={next}
        aria-label="Next slide"
      >
        ›
      </button>

      <div className="hero-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            className={i === index ? 'dot active' : 'dot'}
            aria-label={`Show slide ${i + 1}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}