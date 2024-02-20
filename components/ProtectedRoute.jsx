import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client'

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const {user, isLoading} = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [router, user, isLoading]);

  return <>{children}</>
};

export default ProtectedRoute;
