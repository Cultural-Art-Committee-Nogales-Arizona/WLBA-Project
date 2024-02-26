"use client"
import { useState, useContext, useEffect } from "react"
import CustomUserContext from '@components/GlobalUserContext'
import Error from "@components/overlays/Error"
import Loading from "@components/overlays/Loading"
import AdminForm from "@components/forms/AdminForm"

export default function ManageAdmin(){
    /*
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
    */
   return(
        <AdminForm />
   )
}