import { useEffect } from 'react';
import { useAuth } from './authContext';
import { useRouter } from 'next/navigation';

const useProtectedRoute = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, router]);
};

export default useProtectedRoute;
