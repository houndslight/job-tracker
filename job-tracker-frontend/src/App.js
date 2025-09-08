import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Configure axios to include cookies
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  
  // Auth form state
  const [authData, setAuthData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  // App state
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'applied',
    location: '',
    salary_range: '',
    job_url: '',
    notes: ''
  });

  const statusOptions = [
    { value: 'applied', label: 'Applied', color: 'blue' },
    { value: 'screening', label: 'Phone Screening', color: 'yellow' },
    { value: 'interview', label: 'Interview', color: 'purple' },
    { value: 'offer', label: 'Offer', color: 'green' },
    { value: 'rejected', label: 'Rejected', color: 'red' },
    { value: 'withdrawn', label: 'Withdrawn', color: 'gray' }
  ];

  // Auth functions
  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/`);
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/login/`, {
        username: authData.username,
        password: authData.password
      });
      await checkAuth();
      setAuthData({ username: '', email: '', password: '' });
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/register/`, authData);
      await checkAuth();
      setAuthData({ username: '', email: '', password: '' });
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/logout/`);
      setUser(null);
      setApplications([]);
      setStats({});
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // App functions
  const fetchApplications = async () => {
    try {
      let url = `${API_BASE_URL}/applications/`;
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await axios.get(url);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/applications/stats/`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const createApplication = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/applications/`, formData);
      setFormData({
        company: '',
        role: '',
        status: 'applied',
        location: '',
        salary_range: '',
        job_url: '',
        notes: ''
      });
      setShowForm(false);
      fetchApplications();
      fetchStats();
    } catch (error) {
      console.error('Error creating application:', error);
    }
  };

  const deleteApplication = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await axios.delete(`${API_BASE_URL}/applications/${id}/`);
        fetchApplications();
        fetchStats();
      } catch (error) {
        console.error('Error deleting application:', error);
      }
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/applications/${id}/`, { status: newStatus });
      fetchApplications();
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    const initApp = async () => {
      setLoading(true);
      await checkAuth();
      setLoading(false);
    };
    initApp();
  }, []);

  useEffect(() => {
    if (user) {
      fetchApplications();
      fetchStats();
    }
  }, [user, searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'gray';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Auth screen
  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>🎯 Job Application Tracker</h1>
          <div className="auth-toggle">
            <button 
              className={authMode === 'login' ? 'active' : ''}
              onClick={() => setAuthMode('login')}
            >
              Login
            </button>
            <button 
              className={authMode === 'register' ? 'active' : ''}
              onClick={() => setAuthMode('register')}
            >
              Register
            </button>
          </div>
          
          <form onSubmit={authMode === 'login' ? handleLogin : handleRegister}>
            <input
              type="text"
              placeholder="Username"
              value={authData.username}
              onChange={(e) => setAuthData({...authData, username: e.target.value})}
              required
            />
            {authMode === 'register' && (
              <input
                type="email"
                placeholder="Email"
                value={authData.email}
                onChange={(e) => setAuthData({...authData, email: e.target.value})}
                required
              />
            )}
            <input
              type="password"
              placeholder="Password"
              value={authData.password}
              onChange={(e) => setAuthData({...authData, password: e.target.value})}
              required
            />
            <button type="submit">
              {authMode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main app (same as before but with logout button)
  return (
    <div className="App">
      <header className="app-header">
        <div>
          <h1>🎯 Job Application Tracker</h1>
          <p className="user-welcome">Welcome, {user}!</p>
        </div>
        <div className="header-actions">
          <button 
            className="add-btn"
            onClick={() => setShowForm(!showForm)}
          >
            + Add Application
          </button>
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Stats Dashboard */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Applications</h3>
          <div className="stat-number">{stats.total || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Applied</h3>
          <div className="stat-number blue">{stats.applied || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Interviews</h3>
          <div className="stat-number purple">{stats.interview || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Offers</h3>
          <div className="stat-number green">{stats.offer || 0}</div>
        </div>
      </div>

      {/* Add Application Form */}
      {showForm && (
        <div className="form-container">
          <form onSubmit={createApplication} className="application-form">
            <h2>Add New Application</h2>
            <div className="form-row">
              <input
                type="text"
                placeholder="Company *"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Role *"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                required
              />
            </div>
            <div className="form-row">
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                placeholder="Salary Range"
                value={formData.salary_range}
                onChange={(e) => setFormData({...formData, salary_range: e.target.value})}
              />
              <input
                type="url"
                placeholder="Job URL"
                value={formData.job_url}
                onChange={(e) => setFormData({...formData, job_url: e.target.value})}
              />
            </div>
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
            />
            <div className="form-actions">
              <button type="submit">Add Application</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search companies, roles, locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="">All Statuses</option>
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Applications Table */}
      <div className="applications-container">
        {applications.length === 0 ? (
          <div className="empty-state">
            <h3>No applications found</h3>
            <p>Add your first job application to get started!</p>
          </div>
        ) : (
          <div className="applications-grid">
            {applications.map(app => (
              <div key={app.id} className="application-card">
                <div className="card-header">
                  <h3>{app.role}</h3>
                  <div className="card-actions">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className={`status-select ${getStatusColor(app.status)}`}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button 
                      onClick={() => deleteApplication(app.id)}
                      className="delete-btn"
                      title="Delete application"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <p className="company">{app.company}</p>
                  {app.location && <p className="location">📍 {app.location}</p>}
                  {app.salary_range && <p className="salary">💰 {app.salary_range}</p>}
                  <p className="date">Applied: {formatDate(app.date_applied)}</p>
                  {app.job_url && (
                    <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="job-link">
                      View Job Posting →
                    </a>
                  )}
                  {app.notes && (
                    <div className="notes">
                      <strong>Notes:</strong> {app.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;