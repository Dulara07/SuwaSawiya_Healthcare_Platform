
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
      setLoading(false);
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (payload.role === 'partner') {
        navigate('/partner/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Invalid username or password');
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register({
        username,
        password,
        email,
        full_name: fullName, // backend expects full_name, not fullName
        role
      });
      setRegisterMode(false);
      setLoading(false);
    } catch (err) {
      setError('Registration failed');
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
        {error && <div className="text-red-500 text-sm">{error}</div>}
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
