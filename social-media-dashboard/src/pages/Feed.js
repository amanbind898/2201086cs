import React from "react";

const Feed = () => {
  const posts = [
    { id: 1, user: "Aman Bind", content: "Just built a JEE Main College Predictor!" },
    { id: 2, user: "John Doe", content: "React is awesome! Loving the hooks feature." },
    { id: 3, user: "Jane Smith", content: "Working on a new AI project. Exciting times!" },
  ];

  return (
    <div>
      <h2>📢 Feed</h2>
      {posts.map((post) => (
        <div key={post.id} className="post">
          <h4>{post.user}</h4>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Feed;
