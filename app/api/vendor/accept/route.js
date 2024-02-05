import AcceptedVendor from "@/models/vendors/Accepted";
import Vendor from "@/models/vendors/Vendor";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    const {name, id} = await request.json()

    try{
        const existingVendor = await Vendor.findById(id)

        const newAcceptedVendor = await AcceptedVendor.create({
            name,
            id
        })

        return NextResponse.json({
            success: true,
            message: `Successfully accepted venor`,
            data: newAcceptedVendor
        }, {
            status: 200
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