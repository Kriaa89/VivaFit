import React from 'react';
import { useAuth } from '../../context/AuthContext';

function Dashboard() {
  const { currentUser } = useAuth();
  
  return (
    <div className="container mt-5">
      <h2>Welcome to your Dashboard</h2>
      <p>Hello, {currentUser?.displayName || currentUser?.email}</p>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header">Workout Progress</div>
            <div className="card-body">
              <p>Your workout stats will appear here</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header">Fitness Goals</div>
            <div className="card-body">
              <p>Your fitness goals will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;