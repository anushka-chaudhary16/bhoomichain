import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLands: 0,
    totalTransactions: 0,
    activeUsers: 0,
    totalBlocks: 0
  });
  const [recentTx, setRecentTx] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, txRes] = await Promise.all([
        api.get('/stats'),
        api.get('/transactions?limit=5')
      ]);
      setStats(statsRes.data);
      setRecentTx(txRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader-container"><div className="spinner"></div></div>;

  return (
    <div className="dashboard animate-fade-in">
      <h2 className="page-title">Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon">🗺️</div>
          <div className="stat-info">
            <h3>{stats.totalLands}</h3>
            <p>Total Lands</p>
          </div>
        </div>
        
        <div className="stat-card glass-card">
          <div className="stat-icon">💸</div>
          <div className="stat-info">
            <h3>{stats.totalTransactions}</h3>
            <p>Transactions</p>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.activeUsers}</h3>
            <p>Active Users</p>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-info">
            <h3>{stats.totalBlocks}</h3>
            <p>Mined Blocks</p>
          </div>
        </div>
      </div>

      <div className="recent-section glass-card">
        <h3>Recent Transactions</h3>
        {recentTx.length === 0 ? (
          <p className="no-data">No transactions found.</p>
        ) : (
          <div className="table-responsive">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Land ID</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentTx.map(tx => (
                  <tr key={tx.id}>
                    <td>{tx.id.substring(0, 8)}...</td>
                    <td>
                      <span className={`badge ${tx.type.toLowerCase()}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td>{tx.land_id}</td>
                    <td>{tx.from_user || '-'}</td>
                    <td>{tx.to_user || '-'}</td>
                    <td>{new Date(tx.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
