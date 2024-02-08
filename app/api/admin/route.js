import User from "@/models/users/User";
import Admin from "@/models/users/Admins";
import { NextResponse } from 'next/server';

export const POST = async (request) => {
    const {username, user} = await request.json()
    
    try{
        const userExists = await User.findById(user)

        if(!userExists) throw new Error('User does not exist')

        const newAdmin = await Admin.create({
            username,
            user
        })

        return NextResponse.json({
            success: true,
            message: `Successfully registered ${username} as an Admin.`,
            data: newAdmin,
        },
        { status: 201 }
        );
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `An error occurred registering Admin`,
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
        const adminExists = await Admin.findOne({ id: userId })

        if(!adminExists) throw new Error('User does not exist or is not an Admin.')

        await Admin.deleteOne({ id: userId })

        return NextResponse.json({
            success: true,
            message: `Successfully removed user from admin database`,
        },
        { status: 201 }
        );
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `An error occurred deleting admin`,
            errorMessage: err.message,
            error: err
        }, {
            status: 500
        })
    }
}