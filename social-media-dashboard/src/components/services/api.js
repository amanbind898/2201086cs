const API_BASE_URL = 'http://20.244.56.144/test';

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchUserPosts = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/posts`);
    if (!response.ok) throw new Error(`Failed to fetch posts for user ${userId}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    throw error;
  }
};

export const fetchPostComments = async (postId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);
    if (!response.ok) throw new Error(`Failed to fetch comments for post ${postId}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    throw error;
  }
};
