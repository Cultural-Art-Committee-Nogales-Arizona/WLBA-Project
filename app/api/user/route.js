import User from "@/models/users/User";
import { NextResponse } from 'next/server'
import { isAdmin } from "@/utils/routeMethods";

export const GET = async (request) => {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId') || ""

    try{
        if (!userId) throw new Error("No userId query defined, you must append ?userId=DocumentIdOfUser to URL")

        const user = await User.findById(userId)

        if(!user) throw new Error(`No such user exists with _id: ${userId}`)

        return NextResponse.json({
            success: true,
            message: `Successfully found user`,
            data: user
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

export const POST = async (request) => {
    //We could run a POST request each time a user signs with Auth0, store their information if it isn't already in the database, and return it if it is. 
    const {username, email} = await request.json()

    try{
        const user = await User.findOne({ email: email })

        if(!user){
            const newUser = await User.create({
                username,
                email
            })

            return NextResponse.json({
                success: true,
                message: `Successfully Created User`,
                data: newUser
            }, {
                status: 201
            })
        }

        return NextResponse.json({
            success: true,
            message: `User already exists, returning matching user`,
            data: user
        }, {
            status: 200
        })
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `An error occurred creating user`,
            errorMessage: err.message,
            error: err
        }, {
            status: 500
        })
    }
    /* 
    Do keep in mind the purpose of this is simply to have access to the user's database
    ID in the frontend so that information specific to them can be fetched such as vendors or admin status. 
    We might want to look into using JWT to modify the auth0 session object to add the user's database ID 
    */
}

export const PUT = async (request) => {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const {username, email} = await request.json()

    try{
        if (!userId) throw new Error("No userId query defined, you must append ?userId=DocumentIdOfUser")

        const existingUser = await User.findById(userId)

        if(!existingUser) throw new Error(`User with ID ${userId} does not exist`)

        const newUser = await User.findByIdAndUpdate(userId, {
            username,
            email
        })

        return NextResponse.json({
            success: true,
            message: `Successfully Updated User: ${existingUser.username}`,
            data: newUser
        }, {
            status: 200
        })
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `An error occurred while editing user`,
            errorMessage: err.message,
            error: err
        }, {
            status: 500
        })
    }
}

export const DELETE = async (request) => {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
	const adminId = searchParams.get("adminId") || "";

    try{
        // ! Uncomment line when ready to only allow admins
		// await isAdmin(adminId)

        if (!userId) throw new Error("No userId query defined, you must append ?userId=DocumentIdOfUser")

        const existingUser = await User.findById(userId)

        if(!existingUser) throw new Error(`User with _id: ${userId} does not exist`)

        await User.findByIdAndDelete(userId)

        return NextResponse.json({
            success: true,
            message: `Successfully deleted user with _id: ${userId}`,
        }, {
            status: 200
        })
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `An error occurred deleting user`,
            errorMessage: err.message,
            error: err
        }, {
            status: 500
        })
    }   
}
