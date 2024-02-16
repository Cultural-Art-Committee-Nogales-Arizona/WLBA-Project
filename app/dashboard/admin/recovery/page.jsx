"use client"
import { useState, useContext, useEffect } from "react"
import CustomUserContext from "@components/GlobalUserContext"
import Error from "@components/overlays/Error"
import Loading from "@components/overlays/Loading"

export default function RecoveryPage(){
    const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [formData, setFormData] = useState({})

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        setLoading(true)
    
        const createToken = async () => {
          try {
            const response = await fetch(`/api/admin/recovery?userId=${globalUserData._id}`, { signal, method: 'POST' })
            
            const body = await response.json()

            console.log(body)
          } catch (err) {
            if (err.name !== 'AbortError') {
              console.error('Error fetching users:', err)
              setError(err.name)
              alert('Failed to generate token')
            }
          } finally {
            setLoading(false)
          }
        }
    
        createToken()
    
        return () => controller.abort()
    }, [globalUserData])

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        const controller = new AbortController()
        const signal = controller.signal

        try{
            if (formData.password !== formData.confirmPassword){
                setError(`Passwords must match`)
                throw new Error(`Passwords don't match`)
            }

            let API_Route = `/api/admin/recovery/confirm?userId=${globalUserData._id}`
            const response = await fetch(API_Route, { 
                signal, 
                method: 'POST',
                body: JSON.stringify({
                    newPassword: formData.password,
                    token: formData.token
                })
            })

            const parsedResponse = await response.json()

            console.log(parsedResponse)

            if(response.success){
                console.log('works')
            } else {
                setError(response.message)
            }
            console.log(response)
        } catch (err) {

        } finally {
            setLoading(false)
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
            {error ? <Error params={{error, setError}} /> : null}
            { loading ? <Loading scale={150} /> :
                <form onSubmit={handleSubmit}>
                    <p>Check your email for the 8 character recovery token</p>
                    <div>
                        <label htmlFor="password">New Password</label>
                        <input
                        id="password"
                        type="password"
                        value={formData.password || ''}
                        onChange={(event) => updateForm(event)}
                        placeholder='Create a new password'
                        required
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword">Confirm New Password</label>
                        <input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword || ''}
                        onChange={(event) => updateForm(event)}
                        placeholder='Confirm password'
                        required
                        />
                    </div>
                    <div>
                        <label htmlFor="token">Recovery Token</label>
                        <input
                        id="token"
                        type="password"
                        value={formData.token || ''}
                        onChange={(event) => updateForm(event)}
                        placeholder='Insert your recovery token'
                        pattern="^[0-9A-F]{8}$"
                        required
                        />
                    </div>
                    <input type="submit" value='Validate'/>
                </form>
            }
        </>
    )
}