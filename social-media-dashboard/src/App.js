import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import TopUsers from './components/TopUsers';
import TrendingPosts from './components/TrendingPosts';
import Feed from './components/Feed';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Navigation />
        <main className="content-container">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/top-users" element={<TopUsers />} />
            <Route path="/trending-posts" element={<TrendingPosts />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;