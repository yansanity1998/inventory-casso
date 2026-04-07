import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submitted", { email, password });
  };

  return (
    <div className="w-full flex flex-col items-center">

      {/* Headings aligned perfectly */}
      <div className="text-center space-y-3 mb-10 w-full">
        <h2 className="text-[28px] font-bold tracking-tight text-black font-[var(--heading)]">
          Welcome back
        </h2>
        <p className="text-[13px] text-gray-500 font-[var(--sans)]">
          Sign in to access the Assessor's Office records.
        </p>
      </div>

      {/* Form Fields & Button exactly matching image layout */}
      <form className="w-full space-y-4" onSubmit={handleSubmit}>

        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {/* Mail Icon SVG */}
              <svg className="h-[18px] w-[18px] text-gray-400 group-focus-within:text-green-600 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-[14px] rounded-lg border border-[var(--border)] bg-white text-[var(--text-h)] text-sm focus:ring-1 focus:ring-green-600 focus:border-green-600 focus:placeholder:text-green-600 transition-all outline-none placeholder:text-gray-400"
              placeholder="Email"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {/* Lock Icon SVG */}
              <svg className="h-[18px] w-[18px] text-gray-400 group-focus-within:text-green-600 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-[14px] rounded-lg border border-[var(--border)] bg-white text-[var(--text-h)] text-sm focus:ring-1 focus:ring-green-600 focus:border-green-600 focus:placeholder:text-green-600 transition-all outline-none placeholder:text-gray-400"
              placeholder="Password"
            />
          </div>
        </div>

        <button
          type="submit"
          className="login-btn"
        >
          Login
        </button>
      </form>
    </div>
  );
}
