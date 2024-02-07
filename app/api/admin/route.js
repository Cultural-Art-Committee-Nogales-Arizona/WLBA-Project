import User from "@/models/users/User";
import Admin from "@/models/users/Admins";
import { NextResponse } from 'next/server';
import { generateUserAuthID } from "@/utils/routeMethods";

export const GET = async (/* request */) => {
    // const {username, id} = await request.json()
    
    try{
        const userExists = await User.findById("65c2b1fca56e4271462c48bb")/* ({ _id: id, username: username }) */
        console.log(userExists)
        if(!userExists) throw new Error('This user does not exist')

        const newAdmin = await Admin.create({
            username: username,
            userAuthId: generateUserAuthID(),
            user: id
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

export const POST = async (request) => {
    const {username, id} = await request.json()
    
    try{
        const userExists = await User.findById(id)/* ({ _id: id, username: username }) */
        console.log(userExists)
        if(!userExists) throw new Error('This user does not exist')

        const newAdmin = await Admin.create({
            username: username,
            userAuthId: generateUserAuthID(),
            user: id
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