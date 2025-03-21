import { useState, useEffect, useRef } from 'react';
import * as apiService from '../components/services/api';

// Cache to minimize API calls
const cache = {
  users: null,
  userPosts: {},
  postComments: {},
  lastFetched: {
    users: null,
    userPosts: {},
    postComments: {},
  },
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const useUsers = () => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check if cache is valid
        const now = Date.now();
        if (cache.users && cache.lastFetched.users && (now - cache.lastFetched.users < CACHE_DURATION)) {
          setUsers(cache.users);
        } else {
          const data = await apiService.fetchUsers();
          cache.users = data;
          cache.lastFetched.users = now;
          setUsers(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { users, loading, error };
};

export const useUserPosts = (userId = null, refreshInterval = null) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchUserPosts = async (uid) => {
    try {
      setLoading(true);
      
      const now = Date.now();
      if (
        cache.userPosts[uid] && 
        cache.lastFetched.userPosts[uid] && 
        (now - cache.lastFetched.userPosts[uid] < CACHE_DURATION)
      ) {
        setPosts(oldPosts => {
          // Compare with existing posts to avoid unnecessary re-renders
          if (JSON.stringify(oldPosts) !== JSON.stringify(cache.userPosts[uid])) {
            return cache.userPosts[uid];
          }
          return oldPosts;
        });
      } else {
        const data = await apiService.fetchUserPosts(uid);
        cache.userPosts[uid] = data.posts || [];
        cache.lastFetched.userPosts[uid] = now;
        setPosts(data.posts || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserPosts(userId);
      
      // Set up polling for real-time updates if refreshInterval is provided
      if (refreshInterval) {
        intervalRef.current = setInterval(() => {
          fetchUserPosts(userId);
        }, refreshInterval);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [userId, refreshInterval]);

  return { posts, loading, error, refetch: () => fetchUserPosts(userId) };
};

export const usePostComments = (postId = null) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;
      
      try {
        setLoading(true);
        
        const now = Date.now();
        if (
          cache.postComments[postId] && 
          cache.lastFetched.postComments[postId] && 
          (now - cache.lastFetched.postComments[postId] < CACHE_DURATION)
        ) {
          setComments(cache.postComments[postId]);
        } else {
          const data = await apiService.fetchPostComments(postId);
          cache.postComments[postId] = data.comments || [];
          cache.lastFetched.postComments[postId] = now;
          setComments(data.comments || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  return { comments, loading, error };
};

// Utility function to fetch all users' posts
export const useFetchAllUsersPosts = (users) => {
  const [allPosts, setAllPosts] = useState([]);
  const [userPostCounts, setUserPostCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllPosts = async () => {
      if (!users || !users.users) return;
      
      setLoading(true);
      
      try {
        const userIds = Object.keys(users.users);
        const postsPromises = [];
        const postCounts = {};
        let combinedPosts = [];
        
        // Check if we have cached data for all users
        const now = Date.now();
        let allCached = true;
        
        for (const userId of userIds) {
          if (
            !cache.userPosts[userId] || 
            !cache.lastFetched.userPosts[userId] ||
            (now - cache.lastFetched.userPosts[userId] >= CACHE_DURATION)
          ) {
            allCached = false;
            break;
          }
        }
        
        if (allCached) {
          // Use cached data
          for (const userId of userIds) {
            const posts = cache.userPosts[userId] || [];
            combinedPosts = [...combinedPosts, ...posts];
            postCounts[userId] = posts.length;
          }
        } else {
          // Fetch data for users where cache is invalid
          for (const userId of userIds) {
            if (
              cache.userPosts[userId] && 
              cache.lastFetched.userPosts[userId] && 
              (now - cache.lastFetched.userPosts[userId] < CACHE_DURATION)
            ) {
              // Use cached data for this user
              const posts = cache.userPosts[userId] || [];
              combinedPosts = [...combinedPosts, ...posts];
              postCounts[userId] = posts.length;
            } else {
              // Fetch new data for this user
              postsPromises.push(
                apiService.fetchUserPosts(userId).then(data => {
                  const posts = data.posts || [];
                  cache.userPosts[userId] = posts;
                  cache.lastFetched.userPosts[userId] = now;
                  postCounts[userId] = posts.length;
                  return posts;
                })
              );
            }
          }
          
          // Wait for all fetch promises to resolve
          const newPostsArrays = await Promise.all(postsPromises);
          for (const postsArray of newPostsArrays) {
            combinedPosts = [...combinedPosts, ...postsArray];
          }
        }
        
        setAllPosts(combinedPosts);
        setUserPostCounts(postCounts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, [users]);

  return { allPosts, userPostCounts, loading, error };
};

// Utility function to fetch comments for multiple posts
export const useFetchCommentsForPosts = (posts) => {
  const [postsWithComments, setPostsWithComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      if (!posts || posts.length === 0) {
        setPostsWithComments([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        const now = Date.now();
        const postsWithCommentsData = [];
        
        for (const post of posts) {
          let comments = [];
          
          if (
            cache.postComments[post.id] && 
            cache.lastFetched.postComments[post.id] && 
            (now - cache.lastFetched.postComments[post.id] < CACHE_DURATION)
          ) {
            comments = cache.postComments[post.id];
          } else {
            try {
              const data = await apiService.fetchPostComments(post.id);
              comments = data.comments || [];
              cache.postComments[post.id] = comments;
              cache.lastFetched.postComments[post.id] = now;
            } catch (err) {
              console.error(`Error fetching comments for post ${post.id}:`, err);
              comments = [];
            }
          }
          
          postsWithCommentsData.push({
            ...post,
            comments,
            commentCount: comments.length
          });
        }
        
        setPostsWithComments(postsWithCommentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [posts]);

  return { postsWithComments, loading, error };
};