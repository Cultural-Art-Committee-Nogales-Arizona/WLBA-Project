"use client"
import { useState, useContext, useEffect } from "react"
import CustomUserContext from "@components/GlobalUserContext"
import Loading from "@components/overlays/Loading"
import Error from "@components/overlays/Error"
import Success from "@components/overlays/Success"
import styles from './EmailForm.module.css'

export default function AdminForm({ params }) {
    const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
    const [formData, setFormData] = useState({})
    const [tableData, setTableData] = useState([])
    const [searchResults, setSearchResults] = useState([...tableData])
    const [selectedUser, setSelectedUser] = useState({})
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const searchTable = (searchParam) => {
        const regex = new RegExp(searchParam, 'i')

        const filtered = tableData.filter(tableUser => {
            return regex.test(tableUser.username) || regex.test(tableUser.email)
        })

        setSearchResults(filtered)
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        
        const fetchUsers = async () => {
          try {
            const response = await fetch(`/api/user`, { 
                signal, 
                method: 'GET' ,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "same-origin"
            })
            const fetchedData = await response.json()
            setTableData(fetchedData.data || [])
            setSearchResults(fetchedData.data || [])
          } catch (error) {
            if (error.name !== 'AbortError') {
              console.error('Error fetching users:', error)
            }
          } finally {
            setLoading(false)
          }
        }
    
        fetchUsers()
    
        return () => controller.abort()
    }, [globalUserData])

    const handleUserSelect = (id) => {
        const user = tableData.find((user) => user._id === id);
        setSelectedUser(user);
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)

        if (selectedUser.admin) {
            try{
                const confirmSubmission = prompt(`
                    Remove admin role from this user \n
                    ${selectedUser.username} \n
                    ${selectedUser.email}\n
                    Type "Yes" to confirm
                    `)
                    
                if (confirmSubmission !== "Yes") {
                    alert("Canceled form submission") 
                    return
                } 

                const controller = new AbortController()
                const signal = controller.signal

                let API_Route = `/api/admin?deleteId=${selectedUser._id}`
                const response = await fetch(API_Route, {
                    signal,
                    method: 'DELETE',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    credentials: "same-origin"
                })

                const responseData = await response.json()

                if(responseData.success){
                    setSuccess('Admin removed')
                } else {
                    setError(`Failed to submit the form ${responseData.errorMessage}`)
                    throw new Error(`Admin API failed to parse request. Status code: ${response.status}`)
                }
            } catch (err) {
                console.error('Error submitting the form:', err.message)
            } finally {
                setLoading(false)
            }
            
        } else {
            try{
                if (formData.password !== formData.confirmPassword){
                    setError(`Admin passwords must match`)
                    throw new Error(`Passwords don't match`)
                }

                const confirmSubmission = prompt(`
                    Add user as an admin?\n
                    ${selectedUser.username}\n
                    ${selectedUser.email}\n
                    Admin Password ${formData.password}\n
                    Type "Yes" to confirm \n
                    `)
                    
                if (confirmSubmission !== "Yes") {
                    alert("Canceled form submission") 
                    return
                } 

                const controller = new AbortController()
                const signal = controller.signal

                const response = await fetch(`/api/admin`, {
                    signal,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: "same-origin",
                    body: JSON.stringify({
                        id: selectedUser._id,
                        password: formData.password
                    })
                })

                const responseData = await response.json()

                if(responseData.success){
                    setSuccess('Added Admin')
                } else {
                    setError(`Failed to submit the form ${responseData.errorMessage}`)
                    throw new Error(`Admin API failed to parse request. Status code: ${response.status}`)
                }
            } catch (err) {
                console.error('Error submitting the form: ', err.message)
            } finally {
                setLoading(false)
            }
        }
    }

    const updateForm = (event) => {
        const { id, value } = event.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [id]: value,
        }));
    }

    return (
        <div className={styles.container}>
            {success && <Success params={{success, setSuccess}} />}
            {error && <Error params={{error, setError}} />}
            {loading ? <Loading scale="200" /> :
            <form className={styles.root} onSubmit={event => handleSubmit(event)}>
                <div className={styles.titleBox}>
                    <div className={styles.title}>Search</div>
                    <input className={styles.backgroundInput} onChange={(event) => searchTable(event.target.value)} />
                </div>
                <div className={styles.titleBox}>
                    <div className={styles.title}>Results: {searchResults.length}</div>
                </div>
                <div className={styles.table_container}>
                    <table className={styles.email_table}>
                        <thead>
                            <tr>
                                <th>Is Admin</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className={styles.table_body}>
                            {
                                searchResults.length ?
                                searchResults.map(tableUser => {
                                        return (
                                            <tr key={tableUser._id}>
                                                <td>
                                                    {tableUser.admin?
                                                        'Yes'
                                                        :
                                                        'No'
                                                    }
                                                </td>
                                                <td>
                                                    {tableUser.username}
                                                </td>
                                                <td>
                                                    {tableUser.email}
                                                </td>
                                                <td>
                                                    <button type="button" onClick={() => handleUserSelect(tableUser._id)}>Select</button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr>
                                        <td>No matches</td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
                {selectedUser.username? 
                <>
                    {selectedUser.admin ? (
                                <input className={styles.titleBox} type="submit" value={'Remove Admin Status'} />
                            ) : (
                                <>
                            <div className={styles.titleBox}>
                                <label htmlFor="password">Password</label>
                                <input
                                id="password"
                                type="password"
                                value={formData.password || ''}
                                onChange={(event) => updateForm(event)}
                                placeholder='Create an admin password'
                                required
                                />
                            </div>
                            <div className={styles.titleBox}>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                id="confirmPassword"
                                type="password"
                                value={formData.confirmPassword || ''}
                                onChange={(event) => updateForm(event)}
                                placeholder='Confirm Admin Password'
                                required
                                />
                            </div>
                            <input className={styles.submit} type="submit" value={`Register ${selectedUser.username}`} />
                            </>
                        )} 
                </>
                    :
                    <p className={styles.titleBox}>Select a user</p>
                }
                
            </form>
            }
        </div>
    )
}