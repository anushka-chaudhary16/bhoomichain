import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './TransactionForm.css'; // Name is TransactionForm.css but used for Transactions view

const TransactionForm = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader-container"><div className="spinner"></div></div>;

  return (
    <div className="transactions-container animate-fade-in">
      <h2 className="page-title">Transaction History</h2>
      
      <div className="glass-card full-width-card">
        {transactions.length === 0 ? (
          <p className="no-data">No transactions recorded yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Tx ID</th>
                  <th>Type</th>
                  <th>Land ID</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Timestamp</th>
                  <th>Block Hash</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td className="mono-text" title={tx.id}>{tx.id.substring(0, 8)}...</td>
                    <td>
                      <span className={`badge ${tx.type.toLowerCase()}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="mono-text" title={tx.land_id}>{tx.land_id.substring(0, 6)}...</td>
                    <td>{tx.from_user || '-'}</td>
                    <td>{tx.to_user || '-'}</td>
                    <td>{new Date(tx.timestamp).toLocaleString()}</td>
                    <td className="mono-text">
                      {tx.block_hash ? (
                        <span title={tx.block_hash} style={{color: 'var(--success)'}}>
                          {tx.block_hash.substring(0, 8)}...
                        </span>
                      ) : (
                        <span style={{color: 'var(--danger)'}}>Pending</span>
                      )}
                    </td>
                    <td>
                      {tx.status === 'MINED' ? (
                        <span className="status-indicator mined">Mined</span>
                      ) : (
                        <span className="status-indicator pending">Pending</span>
                      )}
                    </td>
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

export default TransactionForm;
