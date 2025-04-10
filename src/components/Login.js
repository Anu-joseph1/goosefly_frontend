import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@aws-amplify/auth';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newPasswordRequired, setNewPasswordRequired] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await Auth.signIn(username, password);
      
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        setNewPasswordRequired(true);
        setIsLoading(false);
        return;
      }
      
      onLogin(user.username);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      // More specific error handling
      if (err.code === 'NotAuthorizedException' && err.message.includes('password')) {
        setError('Incorrect password. Please try again.');
      } else if (err.code === 'UserNotFoundException') {
        setError('User not found. Please check your username.');
      } else if (err.code === 'PasswordResetRequiredException') {
        navigate('/reset-password');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
      setIsLoading(false);
    }
  };

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await Auth.signIn(username, password);
      await Auth.completeNewPassword(user, newPassword);
      
      setNewPasswordRequired(false);
      onLogin(username);
      navigate('/');
    } catch (err) {
      console.error('Password change error:', err);
      setError(err.message || 'Failed to set new password. Please try again.');
      setIsLoading(false);
    }
  };

  if (newPasswordRequired) {
    return (
      <div className="login-container">
        <form onSubmit={handleNewPasswordSubmit}>
          <h2>Set New Password</h2>
          <p>Welcome {username}! Please set your new password.</p>
          
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter new password (min 8 characters)"
              minLength="8"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Set New Password'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            placeholder="Enter your username"
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="Enter your password"
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        
        <div className="login-options">
          <a href="/forgot-password" className="forgot-password-link">
            Forgot password?
          </a>
          <a href="/register" className="register-link">
            Create new account
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;