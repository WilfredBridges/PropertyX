import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: '',
    role: currentUser.role || '',
    about: currentUser.about || '',
    qualifications: currentUser.qualifications || '',
    cellNumber: currentUser.cellNumber || '',
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  return (
    <div className="profile-container">
      <div className="tabs">
        <button onClick={() => setActiveTab('personal')} className={`tab ${activeTab === 'personal' ? 'active' : ''}`}>
          Personal Information
        </button>
        <button onClick={() => setActiveTab('about')} className={`tab ${activeTab === 'about' ? 'active' : ''}`}>
          About
        </button>
      </div>
      <form onSubmit={handleSubmit} className="profile-form">
        {activeTab === 'personal' && (
          <div>
            <input type="text" placeholder="Username" defaultValue={currentUser.username} id="username" onChange={handleChange} />
            <input type="email" placeholder="Email" defaultValue={currentUser.email} id="email" onChange={handleChange} />
            <input type="password" placeholder="Password (leave blank to keep the same)" id="password" onChange={handleChange} />
            <input type="text" placeholder="Cell Number" defaultValue={currentUser.cellNumber} id="cellNumber" onChange={handleChange} />
          </div>
        )}
        {activeTab === 'about' && (
          <div>
            <input type="text" placeholder="Role" defaultValue={currentUser.role} id="role" onChange={handleChange} />
            <textarea placeholder="About" defaultValue={currentUser.about} id="about" onChange={handleChange} />
            <input type="text" placeholder="Qualifications" defaultValue={currentUser.qualifications} id="qualifications" onChange={handleChange} />
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}