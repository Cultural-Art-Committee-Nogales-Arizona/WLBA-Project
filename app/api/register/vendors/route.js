import Vendor from "@/models/vendors/Vendor";
import AcceptedVendor from "@/models/vendors/Accepted";
import { NextResponse } from "next/server";

export const GET = async (request) => {
    const searchParams = request.nextUrl.searchParams
    const vendorId = searchParams.get('vendorId')

    try{
        let result = await Vendor.find()

        const mapVendors = async () => {
            return result.map(async vendor => {
                let vendorAccepted = await AcceptedVendor.findOne({id: vendor._id}) ? true : false
                return {
                    ...vendor, 
                    accepted: vendorAccepted
                }
            })
        }

        let vendors = mapVendors();

        return NextResponse.json({
            success: true,
            message: `Successfully fetched all vendors`,
            data: vendors || "No vendors"
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
    const {name, description, email, tags, user} = await request.json()

    try{
        const newVendor = await Vendor.create({
            name,
            description,
            tags,
            email,
            user
        })

        return NextResponse.json({
            success: true,
            message: `Successfully regitered vendor ${name}. Wait for acceptance by an admin.`,
            data: result
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
    const vendorId = searchParams.get('vendorId')
    const {name, description, email, tags} = await request.json()

    try{
        const vendor = await Vendor.findByIdAndUpdate(vendorId, {
            name,
            description,
            email,
            tags
        })

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

    try{
        const vendorAccepted = await AcceptedVendor.find({id: vendorId})

        await Vendor.findByIdAndDelete(vendorId)
        if(vendorAccepted) await AcceptedVendor.findByIdAndDelete(vendorAccepted._id)

        return NextResponse.json({
            success: true,
            message: `Successfully deleted Vendor with _id: ${vendorId}`,
        }, {
            status: 202
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