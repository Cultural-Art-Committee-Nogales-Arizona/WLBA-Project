import { NextResponse } from "next/server"
import Token from "@/models/users/Recovery"
import User from "@/models/users/User"
import bcrypt from "bcryptjs"
import { hash } from "@/utils/routeMethods"

export const POST = async (request) => {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const { newPassword, token } = await request.json()

    try{
        const existingAuthToken = await Token.findOne({ user: userId })

        if(!existingAuthToken) throw new Error('Token has expired or is invalid')

        const tokensMatch = await bcrypt.compare(token, existingAuthToken.token)

        if(!tokensMatch) throw new Error('Incorrect token provided')

        const hashedPassword = await hash(newPassword)

        await User.findByIdAndUpdate(userId, {
            adminPassword: hashedPassword
        })

        await Token.findByIdAndDelete(existingAuthToken._id)

        return NextResponse.json({
            success: true,
            message: `Successfully Changed Password`,
        }, {
            status: 200
        })
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `An error occurred resetting password`,
            errorMessage: err.message,
            error: err,
        },
        { status: 500 }
    )
    }
} 