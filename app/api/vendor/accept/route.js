import AcceptedVendor from "@/models/vendors/Accepted";
import Vendor from "@/models/vendors/Vendor";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    const {name, id} = await request.json()

    try{
        const existingVendor = await Vendor.findById(id)

        if (!existingVendor) throw new Error('Vendor does not exist')

        const existingAcceptedVendor = await AcceptedVendor.findOne({ name: name, id: id })

        if (existingAcceptedVendor) throw new Error('Vendor has already been accepted')

        const newAcceptedVendor = await AcceptedVendor.create({
            name,
            id
        })

        return NextResponse.json({
            success: true,
            message: `Successfully accepted vendor ${name}`,
            data: newAcceptedVendor
        }, {
            status: 201
        })
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `Error accepting vendor`,
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
        const existingVendor = await AcceptedVendor.findOne({ id: vendorId })

        if (!existingVendor) throw new Error('Vendor does not exist or has not been accepted')

        await AcceptedVendor.deleteOne({ id:vendorId })

        return NextResponse.json({
            success: true,
            message: `Successfully removed vendor ${existingVendor.name} from accepted vendors list.`,
        }, {
            status: 200
        })
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `Error removing vendor from accepted list`,
            errorMessage: err.message,
            error: err
        }, {
            status: 500
        })
    }
}