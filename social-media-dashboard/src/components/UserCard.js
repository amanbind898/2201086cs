import React from 'react';

function UserCard({ user, rank, avatarIndex }) {
  return (
    <div className="card h-100 shadow">
      <div className="position-absolute top-0 end-0 p-2">
        <span className="badge bg-primary rounded-pill fs-6">Rank #{rank}</span>
      </div>
      <div className="text-center pt-4">
        <img 
          src={`/images/avatar-${avatarIndex || 1}.jpg`} 
          className="rounded-circle border border-3 border-primary" 
          alt={user.name}
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
          }}
        />
      </div>
      <div className="card-body text-center">
        <h5 className="card-title">{user.name}</h5>
        <div className="d-flex justify-content-center mt-3">
          <div className="px-3 border-end">
            <h6 className="mb-0 text-primary">{user.postCount}</h6>
            <small className="text-muted">Posts</small>
          </div>
          <div className="px-3">
            <h6 className="mb-0 text-primary">#{rank}</h6>
            <small className="text-muted">Rank</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;