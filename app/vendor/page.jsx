'use client';

import { useContext, useState, useEffect } from 'react';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Loading from '@components/overlays/Loading';
import ErrorMessage from '@components/overlays/ErrorMessage';
import Error from '@components/overlays/Error';
import Success from '@components/overlays/Success';
import CustomUserContext from '@components/GlobalUserContext';
import styles from './page.module.css'
import Link from 'next/link';

function VendorCenter() {
  const [loading, setLoading] = useState(true)
  const [userVendors, setUserVendors] = useState([])
  const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
  const { user, isLoading } = useUser();
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    setLoading(true)

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

  const handleDelete = async (vendor) => {
    setLoading(true)
    const controller = new AbortController()
    const signal = controller.signal

    try {

      const response = await fetch('/api/vendor', {
        signal,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "same-origin",
        body: JSON.stringify({
          vendors: [vendor]
        })
      })

      const responseData = await response.json()

      if (responseData.success) {
        // router.push('/vendor')
        setSuccess(responseData.message)
      } else {
        setError(`Failed to delete vendors ${responseData.errorMessage}`)
      }
    } catch (err) {
      setError(`Error deleting vendors`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {isLoading && <Loading />}
      {error && <Error params={{ error, setError }} />}
      {success && <Success params={{ success, setSuccess, reload: true }} />}


      <div className={styles.venContainer}>
        <h1>Vendor dashboard</h1>
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
                userVendors?.length ?
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
                          <p>{vendor.accepted ? "Accepted" : "Pending"}</p>
                        </td>
                        <td>
                          <button>
                            <Link href={`/vendor/edit?vendorId=${vendor._id}&name=${vendor.name}&description=${vendor.description}&tags=${vendor.tags}&email=${vendor.email}`}>Edit</Link>
                          </button>
                        </td>
                        <td>
                          <button onClick={() => handleDelete(vendor._id)}>Delete</button>
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

        {user && (
        <>
          <h5>If you are intrested in being a vendor please <Link href={'/vendor/register'}>Sign up</Link></h5>
        </>
      )}
      </div>
    </>
  );
}

export default withPageAuthRequired(VendorCenter, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});
