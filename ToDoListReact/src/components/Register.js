import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function Register({ onRegistered }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/auth/register', { username, password });
      onRegistered(); // נווט לדף לוגין אחרי הרשמה
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-64">
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required className="p-2 border rounded"/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="p-2 border rounded"/>
        <button type="submit" className="bg-green-600 text-white p-2 rounded mt-2">Register</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
