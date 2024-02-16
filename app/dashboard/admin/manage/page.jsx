"use client"
import { useState, useContext, useEffect } from "react"
import CustomUserContext from "@components/GlobalUserContext"
import Error from "@components/overlays/Error"
import Loading from "@components/overlays/Loading"

export default function ManageAdmin(){
    const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
    const [allUsers, setAllUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState({})
    const [error, setError] = useState(false)
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        setLoading(true)
    
        const fetchUsers = async () => {
          try {
            const response = await fetch(`/api/user?userId=${globalUserData._id}&adminId=${globalUserData.adminAuthId}`, { signal, method: 'GET' })
            const fetchedData = await response.json()
            setAllUsers(fetchedData.data)
            console.log(fetchedData.data)
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

    const handleUserSelect = (event) => {
        const user = allUsers.find((user) => user._id === event.target.value);
        setSelectedUser(user);
    };

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

                let API_Route = `/api/admin?adminId=${globalUserData.adminAuthId}&userId=${globalUserData._id}&deleteId=${selectedUser._id}`
                const response = await fetch(API_Route, {
                    signal,
                    method: 'DELETE',
                    headers: {
                    'Content-Type': 'application/json'
                    }
                })

                const responseData = await response.json()

                if(responseData.success){
                    console.log('removed')
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

                let API_Route = `/api/admin?adminId=${globalUserData.adminAuthId}&userId=${globalUserData._id}`
                const response = await fetch(API_Route, {
                    signal,
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: selectedUser._id,
                        password: formData.password
                    })
                })

                const responseData = await response.json()

                if(responseData.success){
                    console.log('added')
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
    };

    return(
        <>
        {error && <Error params={{ error, setError }} />}
        { loading ? <Loading scale={150} /> :
        <form onSubmit={handleSubmit}>
            <fieldset>
            <legend>Select user</legend>
            <select onChange={handleUserSelect}>
                <option value="" disabled>Select a user</option>
                {allUsers.map((user) => (
                    <option key={user._id} value={user._id}>{user.username}</option>
                ))}
            </select>
            </fieldset>
            {selectedUser._id && (
            <>
                <fieldset>
                <p>Selected User: {selectedUser.username || ''}</p>
                <p>Is admin: {selectedUser.admin ? 'True' : 'False'}</p>
                </fieldset>
                <fieldset>
                    {selectedUser.admin ? (
                        <input type="submit" value={'Remove Admin Status'} />
                    ) : (
                        <>
                    <div>
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
                    <div>
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
                    <input type="submit" value={`Register ${selectedUser.username}`} />
                    </>
                )}
                </fieldset>
                    </>
                    )}
                </form>
            }
        </>
    )
}