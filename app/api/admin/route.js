import User from "@/models/users/User";
import Admin from "@/models/users/Admins";
import { NextResponse } from 'next/server';

export const POST = async (request) => {
    const {username, user} = await request.json()
    
    try{
        const userExists = await User.findById(user)

        if(!userExists) throw new Error('This user does not exist')

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