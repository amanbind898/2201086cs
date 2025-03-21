import React from "react";

const TrendingPosts = () => {
  const trending = [
    { id: 1, topic: "React 19 Release" },
    { id: 2, topic: "AI-powered Chatbots" },
    { id: 3, topic: "Next.js Performance Improvements" },
  ];

  return (
    <div>
      <h2>🔥 Trending Posts</h2>
      <ul>
        {trending.map((item) => (
          <li key={item.id}>{item.topic}</li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingPosts;
