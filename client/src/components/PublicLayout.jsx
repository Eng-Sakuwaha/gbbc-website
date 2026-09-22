import { NavLink, Outlet, Link } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaTimes, FaWhatsapp, FaFacebookF, FaEnvelope } from 'react-icons/fa';

const links = [
  ['/', 'Home'],
  ['/about', 'About Us'],
  ['/leadership', 'Leadership'],
  ['/ministries', 'Ministries'],
  ['/weekly-activities', 'Weekly Activities'],
  ['/sermons', 'Sermons'],
  ['/events', 'Events'],
  ['/announcements', 'Announcements'],
  ['/give', 'Give'],
  ['/contact', 'Contact']
];

const WHATSAPP_NUMBER = '260969172928';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  'Hello Grace Bible Baptist Church Kitwe, I would like to know more.'
)}`;

const FACEBOOK_LINK = 'https://www.facebook.com/share/1DkEgAXFJx/?mibextid=wwXIfr';
const CHURCH_EMAIL = 'gracebiblebaptistchurchkitwe@gmail.com';

export default function PublicLayout() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <div className="container nav-wrap">
          <Link to="/" className="brand">
            <img src="/logo.png" alt="Grace Bible Baptist Church Kitwe logo" />
            <div>
              <strong>Grace Bible Baptist Church</strong>
              <span>Kitwe · Loving God. Loving Others.</span>
            </div>
          </Link>

          <button
            className="menu-toggle"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>

          <nav className={open ? 'nav open' : 'nav'}>
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                end={to === '/'}
              >
                {label}
              </NavLink>
            ))}
            <Link
              className="btn-primary"
              to="/contact"
              onClick={() => setOpen(false)}
            >
              Plan Your Visit
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <img src="/logo.png" alt="Church logo" className="footer-logo" />
            <h3>Grace Bible Baptist Church Kitwe</h3>
            <p><em>Loving God. Loving Others.</em></p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul>
              {links.map(([to, label]) => (
                <li key={to}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Visit Us</h4>
            <p>
              Nkana East, near CBU East Gate<br />
              Kitwe, Zambia
            </p>

            <p>
              <a
                className="footer-email"
                href={`mailto:${CHURCH_EMAIL}`}
                aria-label="Email us"
              >
                <FaEnvelope aria-hidden="true" />
                <span>{CHURCH_EMAIL}</span>
              </a>
            </p>

            <p>
              <a
                className="footer-whatsapp"
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
              >
                <FaWhatsapp aria-hidden="true" />
                <span>+260 969 172 928</span>
              </a>
            </p>

            <p>
              <a
                className="footer-facebook"
                href={FACEBOOK_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
              >
                <FaFacebookF aria-hidden="true" />
                <span>Follow us on Facebook</span>
              </a>
            </p>
          </div>
        </div>

        <p className="copyright">
          © {new Date().getFullYear()} Grace Bible Baptist Church Kitwe.
          All Rights Reserved.
        </p>
      </footer>
    </>
  );
}