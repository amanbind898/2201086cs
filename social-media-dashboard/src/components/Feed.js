import React, { useState, useEffect } from 'react';
import { fetchUsers, fetchUserPosts } from './services/api';

function Feed() {
  const [users, setUsers] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch all users
        const userData = await fetchUsers();
        setUsers(userData);
        
        // Fetch posts for each user
        const userIds = Object.keys(userData.users);
        let allPosts = [];
        
        for (const userId of userIds) {
          const postsData = await fetchUserPosts(userId);
          if (postsData.posts && postsData.posts.length > 0) {
            allPosts = [...allPosts, ...postsData.posts];
          }
        }
        
        // Sort posts by ID (assuming higher ID = newer)
        allPosts.sort((a, b) => b.id - a.id);
        
        setPosts(allPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    }
    
    loadData();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      loadData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div>
      <h2 className="mb-4">Latest Posts</h2>
      {posts.map(post => (
        <div key={post.id} className="card mb-3">
          <div className="card-header">
            {users.users[post.userid]} (User ID: {post.userid})
          </div>
          <div className="card-body">
            <p className="card-text">{post.content}</p>
          </div>
          <div className="card-footer text-muted">
            Post ID: {post.id}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Feed;