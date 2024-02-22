"use client"
// ! CHANGE THIS, UNFINISHED
import { useState, useContext, useEffect } from "react"
import CustomUserContext from "@components/GlobalUserContext"

// Overlays
import Loading from "@components/overlays/Loading"
import Error from "@components/overlays/Error"
import Success from "@components/overlays/Success"

// import { useRouter } from "next/router"

import styles from './EmailForm.module.css'

export default function EmailForm({ params }) {
    const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
    // This was breaking it, we need to look into it
    // const router = useRouter()
    let { tableData, formData, setFormData } = params
    // Api route needs to be mutable
    let { contactRoute } = params

    tableData ??= [{ name: "", email: "", description: "", tags: [], _id: 1}]

    const [searchResults, setSearchResults] = useState([...tableData])

    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const toggleAll = (event) => {
        event.preventDefault()
        // Check if all emails are already selected
        const allSelected = searchResults.every(result => formData.emails?.includes(result.email));

        if (allSelected) {
            // If all emails are selected in search results, deselect all
            const allSearchEmails = searchResults.map(result => result.email);
            const removeResults = formData.emails.filter(email => !allSearchEmails.includes(email))
            setFormData(prev => ({
                ...prev,
                emails: removeResults
            }));
        } else {
            // If not all emails are selected, select all
            const allEmails = searchResults.map(result => result.email);
            setFormData(prev => ({
                ...prev,
                emails: allEmails
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
        if (formData.emails === undefined) {
            setFormData({emails: [tableUser.email]})
            return
        }
        setFormData(prevFormData => ({
            ...prevFormData,
            emails: prevFormData.emails?.some(email => email === tableUser.email) ?
                prevFormData.emails?.filter(email => email !== tableUser.email) :
                [...prevFormData?.emails, tableUser.email]
            })
        )
    }


    const handleSubmit = async (event) => {
        event.preventDefault()
        
        if (!formData.emails.length) throw new Error("You need at least one recipient")

        
        try {
            setLoading(true)
            const controller = new AbortController()
            const signal = controller.signal

            const { _id, adminAuthId } = globalUserData
            const response = await fetch(contactRoute, {
                signal,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': globalUserData.adminAuthId,
                    'X-UserId': globalUserData._id
                },
                body: JSON.stringify({
                    subjectLine: formData.subjectLine,
                    emails: formData.emails,
                    message: formData.message
                })
            })

            const responseData = await response.json()

            if (responseData.success) {
                // router.push('/vendor')
                setSuccess(`Posted emails to ${responseData.data.accepted.length} clients`)
            } else {
                setError(`Failed to submit the form ${responseData.errorMessage}`)
                throw new Error(`Vendor API failed to parse request. Status code: ${response.status}`)
            }
        } catch (err) {
            // console.error('Error submitting the form:', err.message)
            // setError(err.message)
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
            {success && <Success params={{success, setSuccess}} />}
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
                                                        checked={formData.emails?.includes(tableUser.email)}
                                                        onChange={() => handleCheckboxChange(tableUser)}
                                                        />
                                                </td>
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
            </form>
            }
        </div>
    )
}