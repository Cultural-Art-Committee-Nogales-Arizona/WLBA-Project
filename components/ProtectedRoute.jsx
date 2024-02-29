"use client"

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
    const token = Cookies.get("token")
    
    if (!token) {
      router.push('/dashboard/admin/sign-in')
    }
  }, [user]);


  return <>{children}</>
};

export default ProtectedRoute;
