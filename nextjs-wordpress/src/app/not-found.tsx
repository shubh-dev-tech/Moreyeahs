import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container">
      <div className="not-found">
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <Link href="/" className="button">
          Go back home
        </Link>
      </div>
    </div>
  );
}
