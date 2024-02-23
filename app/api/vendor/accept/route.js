import AcceptedVendor from "@/models/vendors/Accepted";
import Vendor from "@/models/vendors/Vendor";
import nodemailer from 'nodemailer';
import { NextResponse } from "next/server";
import { isAdmin } from "@/utils/routeMethods";
import { headers } from "next/headers";

export const POST = async (request) => {
    const token = request.cookies.get('token')
    const { vendors, message, subjectLine } = await request.json()

    try {
        if (!token) throw new Error("BAD REQUEST: No cookies found")

        await isAdmin(token.value)

        const responseData = [];

        for (const vendor of vendors) {
            const { name, id, email } = vendor;

            const existingVendor = await Vendor.findById(id);
            if (!existingVendor) throw new Error(`Vendor with ID ${id} does not exist`);

            const existingAcceptedVendor = await AcceptedVendor.findOne({ name, id });
            if (existingAcceptedVendor) throw new Error(`Vendor ${name} with ID ${id} has already been accepted`);

            const newAcceptedVendor = await AcceptedVendor.create({ name, id });

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
                subject: subjectLine,
                text: message
            }

            await transporter.sendMail(mailOptions);
                        
            // Add the created accepted vendor to the response data
            responseData.push({
                vendor: newAcceptedVendor, 
                mail: mailOptions
            });
        }

        return NextResponse.json({
            success: true,
            message: `Successfully accepted ${vendors.length} vendors`,
            data: responseData
        }, {
            status: 201
        });
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `Error accepting vendor(s)`,
            errorMessage: err.message,
            error: err
        }, {
            status: 500
        });
    }
};