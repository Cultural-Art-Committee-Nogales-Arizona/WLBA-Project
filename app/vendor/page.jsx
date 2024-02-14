'use client';

import { useContext, useState, useEffect } from 'react';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Loading from '@components/overlays/Loading';
import ErrorMessage from '@components/overlays/ErrorMessage';
import CustomUserContext from '@components/GlobalUserContext'; 
import styles from './page.module.css'
import Link from 'next/link';

function VendorCenter() {
  const [loading, setLoading] = useState(true)
  const [userVendors, setUserVendors] = useState([])
  const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
  const { user, isLoading } = useUser();

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    setLoading(true)
    console.log(globalUserData)

    const fetchVendors = async () => {
      try {
        const response = await fetch(`/api/vendor?userId=${globalUserData._id}`, { signal, method: 'GET' })
        const fetchedData = await response.json()
        setUserVendors(fetchedData.data)
        setLoading(false)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching vendors:', error)
        }
      }
    }

    fetchVendors()

    return () => controller.abort()
  }, [globalUserData])

  return (
    <>
      {isLoading && <Loading />}
      {/* Temporary link */}
      {globalUserData ? <h1>Welcome {globalUserData.username}</h1> : null}
      <h3>Vendor dashboard</h3>
      
      {user && (
        <>
          <Link href={'/vendor/register'}>Sign up</Link>
        </>
      )}

      <h3>User Vendors</h3>
      <table className={styles.volunteer_table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Description</th>
            <th>Tags</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
        {
          userVendors.length ?
          userVendors.map(vendor => {
            return (
              <tr key={vendor._id}>
                <td>
                  <p>{vendor.name}</p>
                </td>
                <td>
                  <p>{vendor.email}</p>
                </td>
                <td>
                  <p>{vendor.description}</p>
                </td>
                <td>
                  <p>{vendor.tags.join(", ")}</p>
                </td>
                <td>
                  <p>{vendor.accepted? "Accepted": "Pending"}</p>
                </td>
                <td>
                  <Link href={`/vendor/edit?vendorId=${vendor._id}&name=${vendor.name}&description=${vendor.description}&tags=${vendor.tags}&email=${vendor.email}`}>Edit</Link>
                </td>
              </tr>
            )
          })
          :
          <tr>
            <td>No registered vendors</td>
          </tr>
        }
        </tbody>
      </table>
    </>
  );
}

export default withPageAuthRequired(VendorCenter, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});
