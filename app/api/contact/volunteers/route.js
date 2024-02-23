import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { isAdmin } from '@/utils/routeMethods'
import { headers } from 'next/headers'
dotenv.config()

// We need to learn reactMail to make the emails nicer
export const POST = async (request) => {
  const token = request.cookies.get('token')

  try {
    const { emails, subjectLine, message } = await request.json()
    if (!token) throw new Error("BAD REQUEST: No cookies found")
        
		await isAdmin(token.value) 

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
      to: emails, // Emails is an array to sent to many at once
      subject: subjectLine,
      text: message
    }

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: `Successfully send email to clients`,
      data: {
        email: mailOptions,
        accepted: info.accepted,
        rejected: info.rejected,
      }
    },{ 
      status: 200 
    })
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: `Failed to send email to clients`,
      errorMessage: err.message,
      error: err
    },{ 
      status: 500 
    })
  }

}
