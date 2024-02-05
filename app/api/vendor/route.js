import Vendor from "@/models/vendors/Vendor";
import AcceptedVendor from "@/models/vendors/Accepted";
import { NextResponse } from "next/server";

export const GET = async (request) => {
    // Might implement single vendor search in the future
    // const searchParams = request.nextUrl.searchParams
    // const vendorId = searchParams.get('vendorId') || ""

    try {
        const result = await Vendor.find()

        const mapVendors = async () => {
            return result.map(async vendor => {
                const vendorAccepted = await AcceptedVendor.findById(vendor._id) ? true : false
                return {
                    ...vendor,
                    accepted: vendorAccepted
                }
            })
        }

        const returnedVendors = mapVendors();

        return NextResponse.json({
            success: true,
            message: `Successfully fetched all vendors`,
            data: returnedVendors || "No vendors"
        }, {
            status: 200
        })
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `An error occurred getting vendors`,
            errorMessage: err.message,
            error: err
        }, {
            status: 500
        })
    }
}

export const POST = async (request) => {
    const { name, description, email, tags, user } = await request.json()

    try {
        const newVendor = await Vendor.create({
            name,
            description,
            tags,
            email,
            user
        })

        return NextResponse.json({
            success: true,
            message: `Successfully registered vendor: ${name}. Wait for acceptance by an admin.`,
            data: newVendor
        }, {
            status: 201
        })
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `An error occurred registering vendor`,
            errorMessage: err.message,
            error: err
        }, {
            status: 500
        })
    }
}

export const PUT = async (request) => {
    const searchParams = request.nextUrl.searchParams
    const vendorId = searchParams.get('vendorId') || ""
    const { name, description, email, tags } = await request.json()

    try {
        if (!vendorId) throw new Error(`Vendor _id not defined`)

        const vendor = await Vendor.findByIdAndUpdate(vendorId, {
            name,
            description,
            email,
            tags
        })

        if (!vendor) throw new Error(`Vendor with _id: ${vendorId} not found`)

        return NextResponse.json({
            success: true,
            message: `Successfully Updated Vendor: ${name}'`,
            data: vendor
        }, {
            status: 202
        })
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `An error occurred editing vendor ${name}`,
            errorMessage: err.message,
            error: err
        }, {
            status: 500
        })
    }
}

export const DELETE = async (request) => {
    const searchParams = request.nextUrl.searchParams
    const vendorId = searchParams.get('vendorId')

    try {
        /* ---------------- Delete acceptedVendor document if exists ---------------- */

        const vendorAccepted = await AcceptedVendor.findById(vendorId)

        if (!vendorAccepted) throw new Error(`AcceptedVendor with _id ${vendorId} not found`)

        await AcceptedVendor.findByIdAndDelete(vendorId)

        /* ----------------------- Delete vendor if it exists ----------------------- */

        const vendorExists = await Vendor.findById(vendorId)

        if (!vendorExists) throw new Error(`Vendor with _id ${vendorId} not found`)
        
        await Vendor.findByIdAndDelete(vendorId)

        
        return NextResponse.json({
            success: true,
            message: `Successfully deleted Vendor with _id: ${vendorId}`,
        }, {
            status: 204
        })
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `An error occurred deleting vendor with _id: ${vendorId}`,
            errorMessage: err.message,
            error: err
        }, {
            status: 500
        })
    }
}