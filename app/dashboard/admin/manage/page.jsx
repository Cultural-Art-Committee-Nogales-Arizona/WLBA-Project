"use client"
import { useState, useContext } from "react"
import CustomUserContext from "@components/GlobalUserContext"

export default function ManageAdmin(){
    const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
    const [allUsers, setAllUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState({})
    const [error, setError] = useState(false)
    const [formData, setFormData] = useState({})

    const handleSubmit = () => {
        
    }

    return(
        <>
            <form>
                <fieldset>
                    <legend>Select user</legend>
                </fieldset>
                <fieldset>
                    <p>Selected User: {selectedUser.username || ''}</p>
                    <p>Is admin: {selectedUser.admin ? 'True' : 'false'}</p>
                </fieldset>
                <fieldset>
                    {selectedUser.admin? 
                        <input type="submit" value={'Remove Admin Status'}/>
                        :
                        <>
                        <div>
                        <label htmlFor="name">Password</label>
                        <input
                            id="name" 
                            type="text" 
                            value={formData.name || ''} 
                            onChange={event => updateForm(event)} 
                            placeholder='Name of Vendor' 
                            required
                        />
                        </div>
                        <div>
                        <label htmlFor="name">Name</label>
                        <input
                            id="name" 
                            type="text" 
                            value={formData.name || ''} 
                            onChange={event => updateForm(event)} 
                            placeholder='Name of Vendor' 
                            required
                        />
                        </div>
                        </>  
                    }
                </fieldset>
            </form>
        </>
    )
}