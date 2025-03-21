import React, { useMemo } from 'react';
import { useUsers, useFetchAllUsersPosts } from '../hooks/UseDataFetching';
import LoadingSpinner from './LoadingSpinner';
import UserCard from './UserCard';

function TopUsers() {
  const { users, loading: loadingUsers, error: usersError } = useUsers();
  const { userPostCounts, loading: loadingPosts, error: postsError } = useFetchAllUsersPosts(users);
  
  const topUsers = useMemo(() => {
    if (!users || !userPostCounts) return [];
    
    // Convert to array of objects for easier sorting
    const userArray = Object.entries(users.users).map(([id, name]) => ({
      id,
      name,
      postCount: userPostCounts[id] || 0
    }));
    
    // Sort by post count (descending) and take top 5
    return userArray
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 5);
  }, [users, userPostCounts]);
  
  if (loadingUsers || loadingPosts) return <LoadingSpinner />;
  
  if (usersError || postsError) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        Error: {usersError || postsError}
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Top 5 Users by Post Count</h2>
      
      {topUsers.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No user data available.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {topUsers.map((user, index) => (
            <div key={user.id} className="col">
              <UserCard 
                user={user} 
                rank={index + 1} 
                avatarIndex={Number(user.id) % 10} // For consistent but varied avatars
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopUsers;
