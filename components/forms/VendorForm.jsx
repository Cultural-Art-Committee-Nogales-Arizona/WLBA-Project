"use client"
import { useState, useContext } from "react"
import Loading from "@components/overlays/Loading"
import CustomUserContext from "@components/GlobalUserContext"
import Error from "@components/overlays/Error"
import Success from "@components/overlays/Success"
import styles from './EventForm.module.css'

export default function VendorForm({ vendorId, vendorData }){
    const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
    // This was breaking it, we need to look into it
    // const router = useRouter()
    const [formData, setFormData] = useState(vendorData || {})
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const method = vendorId ? 'PUT' : 'POST'

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)

        try{
            const confirmSubmission = prompt(`
                Confirm information\n
                Name: ${formData.name}\n
                Description: ${formData.description}\n
                Tags: ${formData.tags}\n
                Email: ${formData.email}\n
                Type "Yes" to confirm
                `)
                
            if (confirmSubmission !== "Yes") {
                alert("Canceled form submission") 
                return
            }

            const controller = new AbortController()
            const signal = controller.signal

            let API_Route = `/api/vendor`
            if (vendorId) API_Route += `?vendorId=${vendorId}`
            const { _id } = globalUserData
            const response = await fetch(API_Route, {
                signal,
                method: method,
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  name: formData.name,
                  description: formData.description,
                  tags: formData.tags,
                  email: formData.email,
                  user: _id
                })
            })
            
            const responseData = await response.json()

            if(responseData.success){
                // router.push('/vendor')
                setSuccess(responseData.message)
            } else {
                setError(`Failed to submit the form ${responseData.errorMessage}`)
                throw new Error(`Vendor API failed to parse request. Status code: ${response.status}`)
            }
        } catch (err) {
            console.error('Error submitting the form:', err.message)
        } finally {
            setLoading(false)
        }
    }

    const updateForm = (event) => {
        const { id, value } = event.target
      
        setFormData((prevFormData) => ({
          ...prevFormData, 
          [id]: value,
        }))
    }

    return(
        <>
            { error && <Error params={{ error, setError }} />}
            { success && <Success params={{success, setSuccess, redirect: '/vendor'}} />}
            { loading ? <Loading scale={150} /> :
            <form onSubmit={handleSubmit} className={styles.form}>
                <fieldset className={styles.fieldset}>
                    <legend className={styles.legend}>Describe Vendor</legend>
                    <div className={styles.formGroup}>
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
                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description</label>
                        <input
                            id="description" 
                            type="text" 
                            value={formData.description || ''} 
                            onChange={event => updateForm(event)} 
                            placeholder='Description' 
                            required
                        />
                    </div>
                    <div className={styles.formGroup}> 
                        <label htmlFor="tags">Tags</label>
                        <input
                            id="tags" 
                            type="text" 
                            value={formData.tags || ''} 
                            onChange={event => updateForm(event)} 
                            placeholder='Name of Vendor' 
                            required
                        />
                    </div>
                </fieldset>
                <fieldset className={styles.fieldset}>
                    <legend className={styles.legend}>Other Information</legend>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email" 
                            type="text" 
                            value={formData.email || ''} 
                            onChange={event => updateForm(event)} 
                            placeholder='Main email to contact vendor' 
                            required
                        />
                    </div>
                </fieldset>
                <input type="submit" className={styles.submit}/>
            </form>
            }   
        </>
        
    )
}