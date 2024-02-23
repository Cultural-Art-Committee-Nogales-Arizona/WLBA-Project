import User from "@/models/users/User";
import { NextResponse } from 'next/server'
import { isAdmin } from "@/utils/routeMethods";
import { headers } from "next/headers";

export const GET = async (request) => {
    const token = request.cookies.get('token')

    try{
		await isAdmin(token.value) 

        const users = await User.find()

        const data = users.map(user => {
            return {
                _id: user._id,
                username: user.username,
                email: user.email,
                admin: user.admin
            }
        })

        return NextResponse.json({
            success: true,
            message: `Successfully found users`,
            data: data
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
                data: {
                    _id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    admin: newUser.admin
                }
            }, {
                status: 201
            })
        }

        return NextResponse.json({
            success: true,
            message: `User already exists, returning matching user`,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                admin: user.admin
            }
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
        },{
            returnDocument: 'after'
        })

        return NextResponse.json({
            success: true,
            message: `Successfully Updated User: ${existingUser.username}`,
            data: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                admin: newUser.admin
            }
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
    const token = request.cookies.get('token')
    const searchParams = request.nextUrl.searchParams
    const deleteId = searchParams.get('deleteId') || ""

    try{
        await isAdmin(token.value)

        if (!deleteId) throw new Error("No userId query defined, you must append ?deleteId= to URL")

        const existingUser = await User.findById(deleteId)

        if(!existingUser) throw new Error(`User with _id: ${deleteId} does not exist`)

        await User.findByIdAndDelete(deleteId)

        return NextResponse.json({
            success: true,
            message: `Successfully deleted user with _id: ${deleteId}`,
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
