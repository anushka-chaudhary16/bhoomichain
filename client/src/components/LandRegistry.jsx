import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './LandRegistry.css';

const LandRegistry = ({ user }) => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedLand, setSelectedLand] = useState(null);
  const [transferTo, setTransferTo] = useState('');
  
  const [formData, setFormData] = useState({
    location: '',
    area: '',
    survey_number: ''
  });

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    try {
      const res = await api.get('/lands');
      setLands(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/lands', formData);
      setFormData({ location: '', area: '', survey_number: '' });
      fetchLands();
      alert("Land registration initiated!");
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register land');
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      await api.post('/lands/transfer', {
        land_id: selectedLand.id,
        to_email: transferTo
      });
      setShowTransferModal(false);
      setTransferTo('');
      fetchLands();
      alert("Transfer initiated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to transfer land');
    }
  };

  const openTransferModal = (land) => {
    setSelectedLand(land);
    setShowTransferModal(true);
  };

  return (
    <div className="registry-container animate-fade-in">
      <h2 className="page-title">Land Registry</h2>
      
      <div className="registry-grid">
        <div className="register-form-section glass-card">
          <h3>Register New Land</h3>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Location / Address</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required 
              />
            </div>
            <div className="form-group">
              <label>Area (sq. ft)</label>
              <input 
                type="number" 
                value={formData.area}
                onChange={(e) => setFormData({...formData, area: e.target.value})}
                required 
              />
            </div>
            <div className="form-group">
              <label>Survey Number</label>
              <input 
                type="text" 
                value={formData.survey_number}
                onChange={(e) => setFormData({...formData, survey_number: e.target.value})}
                required 
              />
            </div>
            <button type="submit" className="btn-gradient w-100">Submit Registration</button>
          </form>
        </div>

        <div className="lands-list-section glass-card">
          <h3>Registered Lands</h3>
          {loading ? (
            <div className="spinner" style={{margin: '20px auto'}}></div>
          ) : lands.length === 0 ? (
            <p className="no-data">No lands registered yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Location</th>
                    <th>Area</th>
                    <th>Survey No.</th>
                    <th>Owner</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lands.map(land => (
                    <tr key={land.id}>
                      <td>{land.id.substring(0, 8)}...</td>
                      <td>{land.location}</td>
                      <td>{land.area}</td>
                      <td>{land.survey_number}</td>
                      <td>
                        {land.owner_id === user.id ? (
                          <span className="badge success">You</span>
                        ) : (
                          land.owner_email
                        )}
                      </td>
                      <td>
                        {land.owner_id === user.id && (
                          <button 
                            className="btn-outline btn-sm"
                            onClick={() => openTransferModal(land)}
                          >
                            Transfer
                          </button>
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

      {showTransferModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animate-fade-in">
            <h3>Transfer Land Ownership</h3>
            <p className="modal-desc">Transferring Land ID: {selectedLand?.id.substring(0,8)}...</p>
            <form onSubmit={handleTransfer}>
              <div className="form-group">
                <label>Recipient Email Address</label>
                <input 
                  type="email" 
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  required 
                  placeholder="user@example.com"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowTransferModal(false)}>Cancel</button>
                <button type="submit" className="btn-gradient">Confirm Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandRegistry;
