import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [authToken, setAuthToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch test users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/users/test-users');
        console.log('Users data:', response.data);
        setUsers(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch current user profile if authToken exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!authToken) {
        setCurrentUser(null);
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get('/api/users/me', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        console.log('Current user profile:', response.data);
        setCurrentUser(response.data.user);
        setError(null);
      } catch (err) {
        console.error('Error fetching current user:', err);
        setError('Failed to fetch current user profile.');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [authToken]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', formData);
      console.log('Login successful:', response.data);
      // Store token from response
      if (response.data.token) {
        setAuthToken(response.data.token);
        alert('Login successful!');
      } else {
        setError('Login response missing token.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle register form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/register', formData);
      console.log('Registration successful:', response.data);
      alert('Registration successful! You can now login.');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to PathXpert 👑</h1>
        <p>Your Intelligent Path Navigation Assistant</p>
      </header>

      <div className="container">
        <div className="card">
          <h2>Test Users from Backend</h2>
          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <ul>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <li key={index}>{JSON.stringify(user)}</li>
                ))
              ) : (
                <p>No users found</p>
              )}
            </ul>
          )}
        </div>

        <div className="card">
          <h2>Current User Profile</h2>
          {authToken ? (
            currentUser ? (
              <div>
                <p><strong>Name:</strong> {currentUser.name}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
              </div>
            ) : (
              <p>Loading profile...</p>
            )
          ) : (
            <p>Please login to see your profile.</p>
          )}
        </div>

        <div className="card">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="reg-email">Email</label>
              <input
                type="email"
                id="reg-email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <input
                type="password"
                id="reg-password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
