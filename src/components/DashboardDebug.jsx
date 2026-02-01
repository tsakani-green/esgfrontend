import React from 'react';
import { useUser } from '../contexts/UserContext';

const DashboardDebug = () => {
  const { user, loading, isAuthenticated } = useUser();

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <h2>🔍 Dashboard Debug Information</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Authentication Status:</strong> {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Loading:</strong> {loading ? '⏳ Loading...' : '✅ Loaded'}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>User Data:</strong>
        {user ? (
          <pre style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        ) : (
          <span style={{ color: 'red' }}>❌ No user data</span>
        )}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Portfolio Access:</strong> {user?.portfolio_access ? JSON.stringify(user.portfolio_access) : 'None'}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>User Role:</strong> {user?.role || 'Unknown'}
      </div>
      
      <div style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '5px' }}>
        <h3>🎯 Expected Behavior:</h3>
        <ul>
          <li>If you see user data above, authentication is working</li>
          <li>If portfolio_access shows an array, filtering should work</li>
          <li>If role shows 'admin' or 'client', permissions are set</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardDebug;
