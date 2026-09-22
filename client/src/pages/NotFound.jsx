import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="section container" style={{ textAlign: 'center' }}>
      <h1>Page Not Found</h1>
      <p className="muted">The page you are looking for is not available.</p>
      <Link className="btn-primary" to="/">Return Home</Link>
    </div>
  );
}