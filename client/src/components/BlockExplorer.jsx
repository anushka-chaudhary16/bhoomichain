import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './BlockExplorer.css';

const BlockExplorer = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mining, setMining] = useState(false);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const res = await api.get('/blocks');
      setBlocks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMine = async () => {
    setMining(true);
    try {
      const res = await api.post('/blocks/mine');
      if (res.data.success) {
        alert(`Block mined successfully! Block Hash: ${res.data.block.hash.substring(0,10)}...`);
        fetchBlocks();
      } else {
        alert(res.data.message || "No pending transactions to mine.");
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Mining failed');
    } finally {
      setMining(false);
    }
  };

  if (loading) return <div className="loader-container"><div className="spinner"></div></div>;

  return (
    <div className="explorer-container animate-fade-in">
      <div className="explorer-header">
        <h2 className="page-title">Block Explorer</h2>
        <button 
          className="btn-gradient mine-btn" 
          onClick={handleMine}
          disabled={mining}
        >
          {mining ? (
            <>
              <div className="spinner-small"></div> Mining...
            </>
          ) : (
            '⛏️ Mine Pending Block'
          )}
        </button>
      </div>

      <div className="blockchain-visual">
        {blocks.map((block, index) => (
          <React.Fragment key={block.index}>
            <div className="block-card glass-card">
              <div className="block-header">
                <h4>Block #{block.index}</h4>
                <span className="block-time">{new Date(block.timestamp).toLocaleString()}</span>
              </div>
              <div className="block-body">
                <div className="hash-row">
                  <span className="hash-label">Hash:</span>
                  <span className="hash-value current" title={block.hash}>
                    {block.hash.substring(0, 16)}...{block.hash.substring(block.hash.length - 8)}
                  </span>
                </div>
                <div className="hash-row">
                  <span className="hash-label">Prev Hash:</span>
                  <span className="hash-value previous" title={block.previous_hash}>
                    {block.previous_hash === '0' ? 'Genesis Block (0)' : `${block.previous_hash.substring(0, 16)}...`}
                  </span>
                </div>
                <div className="block-stats">
                  <div className="bst">
                    <span>Tx Count</span>
                    <strong>{typeof block.transactions === 'string' ? JSON.parse(block.transactions).length : block.transactions?.length || 0}</strong>
                  </div>
                  <div className="bst">
                    <span>Nonce</span>
                    <strong>{block.nonce}</strong>
                  </div>
                </div>
              </div>
            </div>
            
            {index < blocks.length - 1 && (
              <div className="chain-link">
                <div className="link-arrow">↓</div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BlockExplorer;
