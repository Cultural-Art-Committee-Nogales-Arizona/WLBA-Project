import User from "@/models/users/User"
import { NextResponse } from 'next/server'

export const GET = async (request) => {
    const searchParams = request.nextUrl.searchParams
    const requestEmail = searchParams.get('email') || ""

    try{
        if (!requestEmail) throw new Error("No name query defined, you must append ?name= to URL")

        const searchEmail = new RegExp(requestEmail)

        const user = await User.findOne({ email: { $regex: searchEmail } })

        if(!user) throw new Error(`No such user exists with email: ${requestEmail}`)

        const { username, _id, email, admin } = user
        return NextResponse.json({
            success: true,
            message: `Successfully found user`,
            data: {
                _id, 
                username, 
                email, 
                admin    
            }
        }, {
            status: 200
        })
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `An error occurred fetching user`,
            errorMessage: err.message,
            error: err
        }, {
            status: 500
        })
    }
}