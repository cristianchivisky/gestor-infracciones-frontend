import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

// Custom hook for redirecting unauthenticated users
export const useAuthRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("Redirecting to home because not authenticated.");
      router.push('/'); // Redirect to home
    }
  }, [isAuthenticated, isLoading, router]);
};
