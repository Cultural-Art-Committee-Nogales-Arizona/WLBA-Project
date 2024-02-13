import Vendor from "@/models/vendors/Vendor";
import AcceptedVendor from "@/models/vendors/Accepted";
import { NextResponse } from "next/server";
import { isAdmin } from "@/utils/routeMethods";

export const GET = async (request) => {
    // Might implement single vendor search in the future
    const searchParams = request.nextUrl.searchParams;
	const adminId = searchParams.get("adminId") || "";
	const userId = searchParams.get("userId") || "";
    // const vendorId = searchParams.get('vendorId') || ""

    try {
        // ! Uncomment line when ready to only allow admins
        // We might not make this admin only
		/* 
		if (!adminId) throw new Error("You must append ?adminId= query to URL")
		if (!userId) throw new Error("You must append &userId= query to URL")
        
		await isAdmin(userId, adminId) 
		*/

        const result = userId ? await Vendor.find({ user: userId }) : await Vendor.find()

        //Checks if vendor's _ids are in the AcceptedVendor collection and gives them the boolean accepted status accordingly
        const mapVendors = async () => {
            const finalResult = []

            for(let i = 0; i < result.length; i++){
                const vendorAccepted = await AcceptedVendor.findOne({ id: result[i]._id }) ? true : false
                const updatedVendor = {
                    ...result[i]._doc,
                    accepted: vendorAccepted
                }

                finalResult.push(updatedVendor)
            }

            return finalResult
        }

        const returnedVendors = await mapVendors();

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
        const vendorExists = await Vendor.findOne({ name })

        if(vendorExists) throw new Error('Vendor already exists')

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
    // We need to make this so you cant edit someone elses vendor
    const { name, description, email, tags } = await request.json()

    try {
        if (!vendorId) throw new Error(`Vendor _id not defined`)

        const vendor = await Vendor.findByIdAndUpdate(vendorId, {
            name,
            description,
            email,
            tags
        },{
            returnDocument: 'after'
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
    // We need to make this so you cant delete someone elses vendor
    
    try {
        /* ---------------- Delete acceptedVendor document if exists ---------------- */

        const vendorAccepted = await AcceptedVendor.findOne({ id: vendorId })

        if (vendorAccepted) await AcceptedVendor.findByIdAndDelete(vendorAccepted._id) //throw new Error(`AcceptedVendor with _id ${vendorId} not found`)

        /* ----------------------- Delete vendor if it exists ----------------------- */

        const vendorExists = await Vendor.findById(vendorId)

        if (!vendorExists) throw new Error(`Vendor with _id ${vendorId} not found`)
        
        await Vendor.findByIdAndDelete(vendorId)
        
        return NextResponse.json({
            success: true,
            message: `Successfully deleted Vendor with _id: ${vendorId}`,
        }, {
            status: 200
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