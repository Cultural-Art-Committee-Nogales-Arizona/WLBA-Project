"use client"
// ! CHANGE THIS, UNFINISHED
import { useState, useContext } from "react"
import CustomUserContext from "@components/GlobalUserContext"

// Overlays
import Loading from "@components/overlays/Loading"
import Error from "@components/overlays/Error"
import Success from "@components/overlays/Success"

import { useRouter } from "next/navigation"

import styles from './EmailForm.module.css'

export default function ManageVendorForm({ params }) {
    const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
    const router = useRouter()
    const { tableData, formData, setFormData, accept } = params
    let { contactRoute } = params

    const [searchResults, setSearchResults] = useState([...tableData])

    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const toggleAll = (event) => {
        event.preventDefault()
        // Check if all emails are already selected
        const allSelected = searchResults.every(result => formData.vendors.some(formVendor => formVendor.id == result._id));
        console.log(formData.vendors)
        console.log(allSelected)

        if (allSelected) {
            // If all emails are selected in search results, deselect all
            const allSearchVendors = searchResults.map(result => result._id)
            setFormData(prev => ({
                ...prev,
                vendors: []
            }));
        } else {
            // If not all emails are selected, select all
            const allVendors = searchResults.map(tableUser => ({
                name: tableUser.name,
                email: tableUser.email,
                id: tableUser._id
            }));
            setFormData(prev => ({
                ...prev,
                vendors: allVendors
            }));
        }
    }

    const searchTable = (searchParam) => {
        // Create a regex pattern using the search parameter and the 'i' flag for case-insensitive matching
        const regex = new RegExp(searchParam, 'i')

        // Filter the tableData array based on whether the name or email matches the regex pattern
        const filtered = tableData.filter(tableUser => {
            return regex.test(tableUser.name) || regex.test(tableUser.email) || regex.test(tableUser.description) || regex.test(...tableUser.tags)
        })

        // Update the state with the filtered results
        setSearchResults(filtered)
    }

    // Don't questions it, it works and if you look reeeeeally hard you might be able to read it
    const handleCheckboxChange = (tableUser) => {
        if (formData.vendors === undefined) {
            setFormData(prevFormData => ({
                ...prevFormData,
                vendors: [{
                    name: tableUser.name,
                    email: tableUser.email,
                    id: tableUser._id
                }]
            }))
            return
        }
        setFormData(prevFormData => ({
            ...prevFormData,
            vendors: prevFormData.vendors?.some(vendor => vendor.id === tableUser._id) ?
                prevFormData.vendors?.filter(vendor => vendor.id !== tableUser._id) :
                [...prevFormData?.vendors, {
                    name: tableUser.name,
                    email: tableUser.email,
                    id: tableUser._id
                }]
            })
        )
    }


    const handleSubmit = async (event) => {
        event.preventDefault()
        
        if(accept){
            if (!formData.vendors.length) return setError('You need at least one vendor selected') 
            try {
                setLoading(true)
                const controller = new AbortController()
                const signal = controller.signal

                const response = await fetch(contactRoute, {
                    signal,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "same-origin",
                    body: JSON.stringify({
                        subjectLine: formData.subjectLine,
                        vendors: formData.vendors,
                        message: formData.message
                    })
                })

                const responseData = await response.json()

                if (responseData.success) {
                    // router.push('/vendor')
                    setSuccess(responseData.message)
                } else {
                    setError(`Failed to submit the form ${responseData.errorMessage}`)
                    throw new Error(`Vendor API failed to parse request. Status code: ${response.status}`)
                }
            } catch (err) {
                console.error('Error submitting the form:', err.message)
                // setError(err.message)
            } finally {
                setLoading(false)
            }
        }
    }

    const handleRevoke = async (vendor) => {
        setLoading(true)
        const controller = new AbortController()
        const signal = controller.signal

        try{
            const vendorObject = tableData.filter(result => result._id == vendor)[0]
            if (!vendorObject) return setError('Selected vendor not found')
            const message = prompt(`
            Confirm revoke vendor permit for ${vendorObject.name} \n
            Type in a rejection message
            `)

            if (!message) return setError('Request cancelled')

            const response = await fetch(contactRoute, {
                signal,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    vendorId: vendor,
                    message: message,
                    email: vendorObject.email
                })
            })

            const responseData = await response.json()

            if (responseData.success) {
                // router.push('/vendor')
                setSuccess(responseData.message)
            } else {
                setError(`Failed to submit the form ${responseData.errorMessage}`)
            }
        } catch (err) {
            console.error('Error submitting the form:', err.message)
            setError(`Error submitting the form`)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        setLoading(true)
        const controller = new AbortController()
        const signal = controller.signal

        try{
            const vendors = formData.vendors.map(formVendor => formVendor.id)
            
            const response = await fetch('/api/vendor', {
                signal,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    vendors
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

    const updateForm = (event) => {
        const { id, value } = event.target

        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: value,
        }))
    }

    return (
        <div className={styles.container}>
            {success && <Success params={{success, setSuccess, reload: true}} />}
            {error && <Error params={{error, setError}} />}
            {loading ? <Loading scale="200" /> :
            <form className={styles.root} onSubmit={event => handleSubmit(event)}>
                <div className={styles.titleBox}>
                    <div className={styles.title}>Search</div>
                    <input className={styles.backgroundInput} onChange={(event) => searchTable(event.target.value)} />
                </div>
                <div className={styles.titleBox}>
                    <div className={styles.title}>Selected: {formData.emails?.length || 0}</div>
                    <div className={styles.title}>Results: {searchResults.length}</div>
                </div>
                <div className={styles.table_container}>
                    <table className={styles.email_table}>
                        <thead>
                            <tr>
                                <th className={styles.toggle}>
                                    <button onClick={event => toggleAll(event)}>
                                        Toggle
                                    </button>
                                </th>
                                {accept ? (
                                    <></>
                                )
                                :
                                (
                                    <th className={styles.toggle}>
                                        Revoke
                                    </th>
                                )
                                }
                                
                                <th>Name</th>
                                <th>Email</th>
                                <th>Description</th>
                                <th>Tags</th>
                            </tr>
                        </thead>
                        <tbody className={styles.table_body}>
                            {
                                searchResults.length ?
                                searchResults.map(tableUser => {
                                        return (
                                                <tr key={tableUser._id}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            id={tableUser._id}
                                                            checked={formData.vendors?.some(vendor => vendor.id == tableUser._id)}
                                                            onChange={() => handleCheckboxChange(tableUser)}
                                                        />
                                                    </td>
                                                    {accept?
                                                        <></>
                                                        :
                                                        <td>
                                                            <button type="button" onClick={() => handleRevoke(tableUser._id)}>
                                                                Revoke
                                                            </button>
                                                        </td>
                                                    }
                                                    <td>
                                                        {tableUser.name}
                                                    </td>
                                                    <td>
                                                        {tableUser.email}
                                                    </td>
                                                    <td>
                                                        {tableUser.description}
                                                    </td>
                                                    <td>
                                                        {tableUser.tags.join(", ")}
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
                <button type="button" onClick={handleDelete}>Delete all selected vendors from database</button>
                {accept? (
                    <>
                        <div className={styles.titleBox}>
                    <div className={styles.title}>Subject</div>
                    <input 
                        id="subjectLine"
                        className={styles.backgroundInput} 
                        onChange={event => updateForm(event)}
                        value={formData.subjectLine || ""}
                        />
                </div>
                <div className={`${styles.titleBox} ${styles.message}`}>
                    <div className={styles.title}>Message</div>
                    <textarea 
                        id="message"
                        className={`${styles.backgroundInput} ${styles.textArea}`}  
                        onChange={event => updateForm(event)} 
                        value={formData.message || ""}
                        />
                </div>

                <input type="submit" className={styles.submit} value={"Submit"}></input>
                    </>
                )
                    : 
                    <p></p>
                }
                
            </form>
            }
        </div>
    )
}