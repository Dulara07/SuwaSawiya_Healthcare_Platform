
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api';
import { useUser } from '../contexts/UserContext';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerMode, setRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: setUserSession } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = await login(username, password);
      setUserSession(token);
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (payload.role === 'partner') {
        navigate('/partner/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid username or password');
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Validate inputs
      if (!username.trim()) throw new Error('Username is required');
      if (username.trim().length < 3) throw new Error('Username must be at least 3 characters');
      if (!password.trim()) throw new Error('Password is required');
      if (password.trim().length < 6) throw new Error('Password must be at least 6 characters');
      if (!email.trim()) throw new Error('Email is required');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) throw new Error('Please enter a valid email');
      if (!fullName.trim()) throw new Error('Full name is required');
      
      const registrationData = {
        username: username.trim().substring(0, 50),
        password: password.trim().substring(0, 72),
        email: email.trim(),
        full_name: fullName.trim(),
        role
      };
      
      console.log('Registering with:', registrationData);
      
      const response = await register(registrationData);
      console.log('Registration successful:', response);
      
      // Auto-login after registration
      try {
        const token = await login(username, password);
        setUserSession(token);
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (payload.role === 'partner') {
          navigate('/partner/dashboard');
        } else {
          navigate('/');
        }
      } catch (loginErr) {
        // Registration successful but auto-login failed, go to login page
        setRegisterMode(false);
        setError(null);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={registerMode ? handleRegister : handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold mb-4">{registerMode ? 'Register' : 'Login'}</h2>
        <input
          type="text"
          placeholder="Username or Email"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        {registerMode && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <select value={role} onChange={e => setRole(e.target.value)} className="w-full border px-3 py-2 rounded">
              <option value="admin">Admin</option>
              <option value="partner">Partner</option>
              <option value="donor">Donor</option>
            </select>
          </>
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold" disabled={loading}>
          {loading ? (registerMode ? 'Registering...' : 'Logging in...') : (registerMode ? 'Register' : 'Login')}
        </button>
        <div className="text-center">
          <button type="button" className="text-blue-600 underline text-sm" onClick={() => setRegisterMode(!registerMode)}>
            {registerMode ? 'Already have an account? Login' : 'No account? Register'}
          </button>
        </div>
      </form>
    </div>
  );
}
