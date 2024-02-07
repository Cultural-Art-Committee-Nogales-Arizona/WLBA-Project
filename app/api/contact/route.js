import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config()

export const POST = async (request) => {
  try {
    const { name, email, referralSource, message } = await request.json();

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
      from: email,
      to: 'cultrualartsofnogalesarizona@gmail.com',
      subject: 'New Message from Contact Form',
      text: `Name: ${name}\nEmail: ${email}\nReferral Source: ${referralSource}\nMessage: ${message}`
    }

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
        success: true,
        message: `Successfully sent email to support team`,
        data: info.response,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({
      success: false,
      message: `Failed to send email to support team`,
      errorMessage: err.message,
      error: err
    },
    { status: 500 }
  )
  }

}
