import User from "@/models/users/User";
import { useReducer } from "react";

export const GET = async (request) => {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    try{
        const user = await User.findById(userId)

        if(!user){
            return NextResponse.json({
                success: false,
                message: `No such user exists with ID: ${userId}`,
            }, {
                status: 404
            })
        }

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
            message: `An error occurred getting vendors`,
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
        const user = await User.find({ email: email })

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
            message: `User already exists`,
            data: user
        }, {
            status: 201
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
    /* Do keep in mind the purpose of this is simply to have access to the user's database
    ID in the frontend so that information specific to them can be fetched such as vendors or admin status. 
    We might want to look into using JWT to modify the auth0 session object to add the user's database ID*/
}

export const PUT = async (request) => {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const {username, email} = await request.json()

    try{
        const existingUser = await User.findById(userId)

        if(!existingUser) throw new Error(`User with ID ${userId} does not exist`)

        const newUser = await User.findByIdAndUpdate(userId, {
            username,
            email
        })

        return NextResponse.json({
            success: true,
            message: `Successfully Updated User`,
            data: newUser
        }, {
            status: 200
        })
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `An error occurred while editing user with is ${userId}`,
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

    try{
        const existingUser = await User.findById(userId)

        if(!existingUser) throw new Error(`User with ID ${userId} does not exist`)

        await User.findByIdAndDelete(userId)

        return NextResponse.json({
            success: true,
            message: `Successfully deleted user with ID ${userId}`,
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