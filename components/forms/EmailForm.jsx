"use client"
// ! CHANGE THIS, UNFINISHED
import { useState, useContext } from "react"
import Loading from "@components/overlays/Loading"
import CustomUserContext from "@components/GlobalUserContext"
import Error from "@components/overlays/Error"
// import { useRouter } from "next/router"
import styles from './EmailForm.module.css'

export default function EmailForm({ vendorId, vendorData }){

    //! TEMP USERS 
    const searchResults = [
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          tags: ['tag1', 'tag2', 'tag3']
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          description: 'Nulla facilisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
          tags: ['tag2', 'tag3', 'tag4']
        },
        {
          _id: '3',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          description: 'Sed euismod semper orci, ut gravida nisi maximus vel.',
          tags: ['tag1', 'tag4', 'tag5']
        }
      ];
    const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
    // This was breaking it, we need to look into it
    // const router = useRouter()
    const [formData, setFormData] = useState(vendorData || {})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const method = vendorId ? 'PUT' : 'POST'

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)

        try{
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
                // success()
            } else {
                setError(`Failed to submit the form ${responseData.errorMessage}`)
                throw new Error(`Vendor API failed to parse request. Status code: ${response.status}`)
            }
        } catch (err) {
            console.err('Error submitting the form:', err.message)
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
            <form className={styles.root}>
                <div className={styles.titleBox}>
                    <div className={styles.title}>Search</div>
                    <input className={styles.backgroundInput} />
                </div>
                <div className={styles.table_container}>
                    <table className={styles.email_table}>
                        <thead>
                            <tr>
                                <th>{/* <button onClick={toggleAll}> */}Toggle{/* </button> */}</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Description</th>
                                <th>Tags</th>
                            </tr>
                        </thead>
                        <tbody className={styles.table_body}>
                        {
                        searchResults.length ?
                        searchResults.map(vendor => {
                            return (
                            <tr key={vendor._id}>
                                <td>
                                <input
                                    type="checkbox"
                                    id={vendor._id}
                                    // checked={formData.vendors.some(v => v.id === vendor._id)}
                                    // onChange={() => handleCheckboxChange(vendor)}
                                />
                                </td>
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
                <div className={styles.titleBox}>
                    <div className={styles.title}>Subject</div>
                    <input className={styles.backgroundInput} />
                </div>
                {/* <div className={styles.titleBox}>
                    <div className={styles.title}>Message</div>
                    <input className={styles.textArea}>
                    </input>
                </div> */}
                
                {/* <div className={styles.frame10}>
                    <div className={styles.submit}>Submit</div>
                </div> */}
            </form>
        </>
        
    )
}