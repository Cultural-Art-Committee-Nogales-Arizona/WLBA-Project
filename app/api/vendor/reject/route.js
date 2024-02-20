import AcceptedVendor from "@/models/vendors/Accepted";
import Vendor from "@/models/vendors/Vendor";
import nodemailer from 'nodemailer';
import { NextResponse } from "next/server";
import { isAdmin } from "@/utils/routeMethods";
import { headers } from "next/headers";

export const DELETE = async (request) => {
    const headerList = headers()
    const searchParams = request.nextUrl.searchParams
    const userId = headerList.get('x-userid')
    const adminId = headerList.get('authorization')
    const vendorId = searchParams.get('vendorId')

    try{
        if (!adminId) throw new Error("You must append authorization header")
	    if (!userId) throw new Error("You must append user ID header")

        await isAdmin(userId, adminId)

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