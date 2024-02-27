import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client'
import Cookies from 'js-cookie'

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const {user, isLoading} = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [router, user, isLoading]);

  const token = useMemo(() => {
    return Cookies.get("token")
  }, [user])

  if (!token) {
    router.push('/dashboard/admin/sign-in')
  }

  return <>{children}</>
};

export default ProtectedRoute;
