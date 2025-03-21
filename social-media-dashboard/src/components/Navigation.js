import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="bg-dark p-2">
      <div className="container">
        <ul className="nav nav-pills justify-content-center">
          <li className="nav-item">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active bg-primary' : 'text-white'}`}>
              Feed
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/top-users" className={`nav-link ${location.pathname === '/top-users' ? 'active bg-primary' : 'text-white'}`}>
              Top Users
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/trending-posts" className={`nav-link ${location.pathname === '/trending-posts' ? 'active bg-primary' : 'text-white'}`}>
              Trending Posts
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;