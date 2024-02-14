"use client"
import { useState, useContext, useEffect } from "react"
import CustomUserContext from "@components/GlobalUserContext"
import Error from "@components/overlays/Error"

export default function ManageAdmin(){
    const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
    const [allUsers, setAllUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState({})
    const [error, setError] = useState(false)
    const [formData, setFormData] = useState({})

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        //setLoading(true)
        console.log(globalUserData)
    
        const fetchUsers = async () => {
          try {
            const response = await fetch(`/api/user?userId=${globalUserData._id}&adminId=${globalUserData.adminAuthId}`, { signal, method: 'GET' })
            const fetchedData = await response.json()
            setAllUsers(fetchedData.data)
            console.log(fetchedData.data)
            //setLoading(false)
          } catch (error) {
            if (error.name !== 'AbortError') {
              console.error('Error fetching users:', error)
            }
          }
        }
    
        fetchUsers()
    
        return () => controller.abort()
    }, [globalUserData])

    const handleUserSelect = (userId) => {
        const user = allUsers.find((user) => user._id === userId);
        setSelectedUser(user);
    };

    const handleSubmit = () => {
        if (selectedUser.admin) {
            
        } else {
            
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
        <form onSubmit={handleSubmit}>
            <fieldset>
            <legend>Select user</legend>
            <select onChange={(e) => handleUserSelect(e.target.value)}>
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
        </>
    )
}