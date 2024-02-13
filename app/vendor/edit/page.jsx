"use client"
import { useState } from "react"
import VendorForm from "@components/forms/vendorForm"

export default function RegisterVendor({ params }){

    return(
        <>
            <VendorForm vendorId={ params.vendorId }/>
        </>
    )
}