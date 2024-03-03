import AcceptedVendor from "@/models/vendors/Accepted";
import Vendor from "@/models/vendors/Vendor";
import nodemailer from 'nodemailer';
import { NextResponse } from "next/server";
import { isAdmin } from "@/utils/routeMethods";

export const DELETE = async (request) => {
    const token = request.cookies.get('token')
    const { vendorId, message, email } = await request.json()

    try{
        if (!token) throw new Error("BAD REQUEST: No cookies found")

        await isAdmin(token.value)

        const existingVendor = await AcceptedVendor.findOne({ id: vendorId })

        if (!existingVendor) throw new Error('Vendor does not exist or has not been accepted')

        await AcceptedVendor.deleteOne({ id:vendorId })

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            port: 465,
            host: "smtp.gmail.com",
            auth: {
            user: process.env.CACNA_EMAIL, // Your Gmail email address
            pass: process.env.CACNA_PASSWORD, // Your Gmail password or application-specific password
            },
            secure: true
        });
    
        const mailOptions = {
            from: 'cultrualartsofnogalesarizona@gmail.com',
            to: email, // Emails is an array to sent to many at once
            subject: `Vendor permission revoked`,
            text: message
        }

        await transporter.sendMail(mailOptions);

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