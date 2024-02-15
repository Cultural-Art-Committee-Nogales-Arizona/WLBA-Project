import { NextResponse } from "next/server"
import Token from "@/models/users/Recovery"
import { generateRecoveryToken, generateExpiryDate } from "@utils/routeMethods"
import nodemailer from 'nodemailer'

export const POST = async (request) => {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId') || ''

    try{
        if(!userId) throw new Error('No ?userId= parameter was appended to the request')
        if(!userEmail) throw new Error('No ?userEmail= parameter was appended to the request')

        const existingRecoveryToken = await Token.findOne({ user: userId })

        if(existingRecoveryToken){
            const rightNow = new Date()

            if(new Date(existingRecoveryToken.expires < rightNow)){
                await Token.findByIdandDelete(existingRecoveryToken._id)
            } else {
                return NextResponse.json({
                    success: true,
                    message: `Valid token exists`,
                },
                { status: 200 })
            }
        }

        const newToken = await Token.create({
            user: userId,
            token: generateRecoveryToken(),
            expires: generateExpiryDate()
        })

        const transporter = nodemailer.createTransport({
            port: 465,
            host: "smtp.gmail.com",
            auth: {
                user: process.env.CACNA_EMAIL, // Your Gmail email address
                pass: process.env.CACNA_PASSWORD, // Your Gmail password or application-specific password
            },
            secure: true
        })

        const mailOptions = {
            from: 'cultrualartsofnogalesarizona@gmail.com',
            to: userEmail,
            subject: 'Recover admin password',
            text: `Your recovery token is ${newToken.token}`
        }

        await transporter.sendMail(mailOptions);

        return NextResponse.json({
            success: true,
            message: `Created user token`,
        },
        { status: 201 })
    } catch (err) {
        console.error(err);
		return NextResponse.json({
				success: false,
				message: `An error occurred setting up a recovery token`,
				errorMessage: err.message,
				error: err,
			},
			{ status: 500 }
		)
    }
}