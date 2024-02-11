import User from "@/models/users/User";
import { NextResponse } from 'next/server';
import { generateUserAuthID, isAdmin, hashPassword } from "@/utils/routeMethods";
import bcrypt from 'bcryptjs'

export const GET = async (request) => {
    const searchParams = request.nextUrl.searchParams;
	const username = searchParams.get("username") || "";
    const password = searchParams.get("password") || "";
    
    try{
        if (!username) throw new Error("You must append ?username= query to URL")

        const isUsernameAdmin = await Admin.findOne({ username })
        
        if (!isUsernameAdmin) {
            const userExists = await User.findOne({ username })
            if(!userExists) throw new Error(`User: ${username} does not exist`)
        }

        let returnedAdmin = {
            // Return a boolean value for admin, for safety
            admin: !!isUsernameAdmin,
        }

        // Return the userAuthId only if the correct password is supplied and user is an admin
        if (password && isUsernameAdmin) {
            const passwordMatch = await bcrypt.compare(password, isUsernameAdmin.password)
            if (!passwordMatch) throw new Error("User is unauthorized") 
            returnedAdmin.userAuthId = isUsernameAdmin.userAuthId
        }

        return NextResponse.json({
            success: true,
            message: `Successfully fetched ${username}`,
            data: returnedAdmin
        },{ 
            status: 200
        });
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `An error occurred fetching Admin`,
            errorMessage: err.message,
            error: err
        }, {
            status: 500
        })
    }
}

export const POST = async (request) => {
    const searchParams = request.nextUrl.searchParams;
	const password = searchParams.get("password") || "";
	const adminId = searchParams.get("adminId") || "";
    const { username, id } = await request.json()
    
    try{
        if (!adminId) throw new Error("You must append ?adminId= query to URL")
        if (!password) throw new Error("You must append &password= query to URL")

        await isAdmin(adminId)

        // Generate a password used to get the userAuthId in another route
        const hashedPassword = await hashPassword(password)

        const  existingAdmin = await Admin.findOne({ user: id })
        
        if (existingAdmin) {
            const { _id, username, user } = existingAdmin
            return NextResponse.json({
                success: true,
                message: `User already admin, returning fetched user: ${username}`,
                data: { _id, username, user }, // Leave out userAuthId for safety
            },{ 
                status: 200 
            })
        }

        const newAdmin = await Admin.create({
            username: username,
            userAuthId: generateUserAuthID(),
            user: id,
            password: hashedPassword
        })

        return NextResponse.json({
            success: true,
            message: `Successfully registered ${username} as an Admin.`,
            data: newAdmin,
        },{ 
            status: 201 
        });
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `An error occurred registering Admin`,
            errorMessage: err.message,
            error: err
        },{
            status: 500
        })
    }
}

export const DELETE = async (request) => {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId') || ""
    const deleteUser = searchParams.get('deleteUser') || ""

    try{
        if (!userId) throw new Error("You must append ?userId= query to URL")

        const shouldDeleteUser = deleteUser === 'true' ? true : false 

        const adminExists = await Admin.findOne({ id: userId })

        if(!adminExists) throw new Error('User does not exist or is not an Admin.')

        await Admin.findOneAndDelete({ user: userId })

        let message = `Successfully removed user from admin database`
        
        /* ----------------- Delete user if query "deleteUser=true" ----------------- */

        if (shouldDeleteUser) {
            const userDeleted = await User.findByIdAndDelete(userId)
            if (userDeleted) message += `and user database`
        }

        /* -------------------------------------------------------------------------- */

        return NextResponse.json({
            success: true,
            message: message,
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