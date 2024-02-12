import AcceptedVendor from "@/models/vendors/Accepted";
import Vendor from "@/models/vendors/Vendor";
import nodemailer from 'nodemailer';
import { NextResponse } from "next/server";
import { isAdmin } from "@/utils/routeMethods";

export const DELETE = async (request) => {
    const searchParams = request.nextUrl.searchParams
	const adminId = searchParams.get("adminId") || "";
	const userId = searchParams.get("userId") || "";
    const vendorId = searchParams.get('vendorId')

    try{
        // ! Uncomment line when ready to only allow admins
		/* 
		if (!adminId) throw new Error("You must append ?adminId= query to URL")
		if (!userId) throw new Error("You must append &userId= query to URL")
        
		await isAdmin(userId, adminId) 
		*/

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