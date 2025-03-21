// components/TrendingPosts.js
import React, { useState, useEffect, useMemo } from 'react';
import { useUsers, useFetchAllUsersPosts, useFetchCommentsForPosts } from '../hooks/UseDataFetching.js';
import LoadingSpinner from './LoadingSpinner';
import PostCard from './PostCard.js';

function TrendingPosts() {
  const { users, loading: loadingUsers } = useUsers();
  const { allPosts, loading: loadingPosts } = useFetchAllUsersPosts(users);
  const { postsWithComments, loading: loadingComments } = useFetchCommentsForPosts(allPosts);
  
  const [, setRefreshCounter] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCounter(prev => prev + 1);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  const trendingPosts = useMemo(() => {
    if (!postsWithComments || postsWithComments.length === 0) return [];
    
    // Find the maximum comment count
    const maxCommentCount = Math.max(...postsWithComments.map(post => post.commentCount));
    
    // Return all posts that have this maximum comment count
    return postsWithComments
      .filter(post => post.commentCount === maxCommentCount)
      .sort((a, b) => b.id - a.id); // Sort by newest post first (assuming higher ID means newer)
  }, [postsWithComments]);
  
  const isLoading = loadingUsers || loadingPosts || loadingComments;
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Trending Posts</h2>
      <p className="text-center text-muted mb-4">
        Showing {trendingPosts.length} post{trendingPosts.length !== 1 ? 's' : ''} with the most comments ({trendingPosts[0]?.commentCount || 0})
      </p>
      
      {trendingPosts.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No trending posts available at this time.
        </div>
      ) : (
        <div className="row row-cols-1 g-4">
          {trendingPosts.map(post => (
            <div key={post.id} className="col">
              <PostCard 
                post={post} 
                userName={users?.users[post.userid] || 'Unknown User'} 
                isTrending={true}
                showComments={true}
                imageIndex={post.id % 15} 
                avatarIndex={post.userid % 10}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrendingPosts;