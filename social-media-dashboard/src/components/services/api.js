const API_BASE_URL = 'http://20.244.56.144/test';

// Your Bearer Token
const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNTY1MDIzLCJpYXQiOjE3NDI1NjQ3MjMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImRkZmM5ZThiLTY3MDktNDliZS1hNTljLTJmNWIxMGY0YTE4NCIsInN1YiI6ImFtYW4uMjIwMTA4NmNzQGlpaXRiaC5hYy5pbiJ9LCJjb21wYW55TmFtZSI6ImdvTWFydCIsImNsaWVudElEIjoiZGRmYzllOGItNjcwOS00OWJlLWE1OWMtMmY1YjEwZjRhMTg0IiwiY2xpZW50U2VjcmV0IjoiaWdSQWJhWUlyUHdEY3dqZyIsIm93bmVyTmFtZSI6IkFtYW4gS3VtYXIgQmluZCIsIm93bmVyRW1haWwiOiJhbWFuLjIyMDEwODZjc0BpaWl0YmguYWMuaW4iLCJyb2xsTm8iOiIyMjAxMDg2Y3MifQ.a1SSSIZY7iWkas1lJ0nA1Jc-a9dqrx6E-IuiPuwv3dM";

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchUserPosts = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/posts`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) throw new Error(`Failed to fetch posts for user ${userId}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    throw error;
  }
};

export const fetchPostComments = async (postId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) throw new Error(`Failed to fetch comments for post ${postId}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    throw error;
  }
};
