'use client'
import { useAuth } from '@/hooks/authContext';
import { adminLogin } from '@/services/login.service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const LoginPage = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [number, setNumber] = useState<any>();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await adminLogin(number)
      if(user.status === 200) {
        login();
        localStorage.setItem('token', user?.token);
        router.push('/dashboard'); // Redirect to dashboard
      }
      toast.info(user?.message)
    } catch (error) {
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Admin Login</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700">Contact number</label>
            <input
              type="text"
              id="number"
              defaultValue={number}
              onChange={(e) => setNumber(e.target.value)}
              required
              className="block w-full p-2 mt-1 border rounded-md focus:ring focus:ring-blue-200"
            />
          </div>         
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
