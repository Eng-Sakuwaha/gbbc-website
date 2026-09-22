import { useEffect } from 'react';

export default function Seo({ title, description, image }) {
  useEffect(() => {
    if (title) document.title = title;
    const setMeta = (name, content, attr = 'name') => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', description);
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:image', image, 'property');
    setMeta('twitter:title', title, 'name');
    setMeta('twitter:description', description, 'name');
  }, [title, description, image]);
  return null;
}