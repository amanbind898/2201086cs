import React, { useState, useEffect } from 'react';
import { fetchUsers, fetchUserPosts } from '../api';

function TopUsers() {
  const [users, setUsers] = useState(null);
  const [userPosts, setUserPosts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch all users
        const userData = await fetchUsers();
        setUsers(userData);
        
        // Fetch posts for each user
        const userIds = Object.keys(userData.users);
        const postCounts = {};
        
        for (const userId of userIds) {
          const postsData = await fetchUserPosts(userId);
          postCounts[userId] = (postsData.posts || []).length;
        }
        
        setUserPosts(postCounts);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  }
  
  // Get top 5 users by post count
  const topUsers = Object.entries(users.users)
    .map(([id, name]) => ({
      id,
      name,
      postCount: userPosts[id] || 0
    }))
    .sort((a, b) => b.postCount - a.postCount)
    .slice(0, 5);

  return (
    <div>
      <h2 className="mb-4">Top 5 Users</h2>
      <div className="row">
        {topUsers.map((user, index) => (
          <div key={user.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">Posts: {user.postCount}</p>
                <p className="card-text">Rank: #{index + 1}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopUsers;