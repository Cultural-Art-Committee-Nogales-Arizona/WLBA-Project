import User from "@/models/users/User";
import { NextResponse } from 'next/server';
import { generateUserAuthID, isAdmin, hashPassword } from "@/utils/routeMethods";
import bcrypt from 'bcryptjs'

export const GET = async (request) => {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId") || "";
	const username = searchParams.get("username") || "";
    const password = searchParams.get("password") || "";
    
    try{
        if (!username) throw new Error("You must append ?username= query to URL")

        const isUserAdmin = await User.findOne({ _id: userId, username, admin: true })
        
        if (!isUserAdmin) {
            return NextResponse.json({
                success: false,
                message: `Failed to authenticate Admin`,
                errorMessage:  `User: ${username} does not exist or is not an admin`
            }, {
                status: 403
            })
        } 

        // Return the userAuthId only if the correct password is supplied and user is an admin
        if (password && isUserAdmin) {
            const passwordMatch = await bcrypt.compare(password, isUserAdmin.adminPassword)
            if (!passwordMatch) throw new Error("User is unauthorized") 
        }

        return NextResponse.json({
            success: true,
            message: `Successfully fetched ${username}`,
            data: {
                adminAuthId: isUserAdmin.adminAuthId
            }
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
	const adminId = searchParams.get("adminId") || "";
    const { id, password } = await request.json()
    
    try{
        if (!adminId) throw new Error("You must append ?adminId= query to URL")
        
        await isAdmin(adminId)

        // Generate a password used to get the userAuthId in another route
        const hashedPassword = await hashPassword(password)

        const existingAdmin = await User.findOne({ _id: id, admin: true})
        
        if (existingAdmin) {
            return NextResponse.json({
                success: true,
                message: `User already admin, returning fetched user: ${existingAdmin.username}`,
                data: { 
                    _id: existingAdmin._id,
                    username: existingAdmin.username,
                    email: existingAdmin.email,
                    admin: existingAdmin.admin,
                    adminAuthId: existingAdmin.adminAuthId
                }
            },{ 
                status: 200 
            })
        }

        const newAdmin = await User.findByIdAndUpdate(id, {
            adminAuthId: generateUserAuthID(),
            admin: true,
            adminPassword: hashedPassword
        },{
            returnDocument: 'after'
        })

        return NextResponse.json({
            success: true,
            message: `Successfully registered ${ newAdmin.username } as an Admin.`,
            data: {
                _id: newAdmin._id,
                username: newAdmin.username,
                email: newAdmin.email,
                admin: newAdmin.admin,
                adminAuthId: newAdmin.adminAuthId
            },
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

        const adminExists = await User.findOne({ _id: userId, admin: true })

        if(!adminExists) throw new Error('User does not exist or is not an Admin.')

        await User.findByIdAndUpdate(userId, {
            adminAuthId: "",
            admin: false,
            adminPassword: ""
        })

        let message = `Successfully removed admin role from user`
        
        /* ----------------- Delete user if query "deleteUser=true" ----------------- */

        if (shouldDeleteUser) {
            const userDeleted = await User.findByIdAndDelete(userId)
            if (userDeleted) message += ` and deleted from user database`
        }

        /* -------------------------------------------------------------------------- */

        return NextResponse.json({
            success: true,
            message: message,
        },{ 
            status: 201 
        });
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