"use client"
import VendorForm from "@/components/forms/VendorForm"
import { useSearchParams } from "next/navigation"

export default function RegisterVendor(){
    const searchParams = useSearchParams()
    const vendorId = searchParams.get('vendorId')
    const vendorData = {
        name: searchParams.get('name'),
        description: searchParams.get('description'),
        tags: searchParams.get('tags'),
        email: searchParams.get('email')
    }

    return(
        <>
            <VendorForm 
                vendorId={ vendorId }
                vendorData={ vendorData }
            />
        </>
    )
}