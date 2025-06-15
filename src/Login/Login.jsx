// src/Login.jsx
import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  // Form state for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Dummy login handler – replace with your authentication logic.
  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@example.com' && password === 'password') {
      toast.success('Welcome admin!');
      // On successful login, navigate to home after a delay (use proper routing in real apps)
      setTimeout(() => {
        window.location.href = '/home';
      }, 1500);
    } else {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light p-4">
      <ToastContainer />
      <div className="w-full max-w-md">
        <form 
          onSubmit={handleLogin} 
          className="bg-secondary shadow-lg rounded px-8 py-10"
        >
          <div className="flex justify-center mb-6">
            <FaUserCircle size={64} className="text-primary" />
          </div>
          <div className="mb-5">
            <label 
              htmlFor="email" 
              className="block text-light text-base font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-dark rounded focus:outline-none focus:ring-2 focus:ring-primary text-dark"
              required
            />
          </div>
          <div className="mb-6">
            <label 
              htmlFor="password" 
              className="block text-light text-base font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-dark rounded focus:outline-none focus:ring-2 focus:ring-primary text-dark"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-primary hover:bg-dark text-light font-bold rounded transition-colors duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
