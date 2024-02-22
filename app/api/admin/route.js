import User from "@/models/users/User";
import { NextResponse } from 'next/server';
import { generateUserAuthID, isAdmin, hash } from "@/utils/routeMethods";
import { headers } from 'next/headers'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { cookies } from "next/headers";

dotenv.config()
  
// Get a hashed adminAuthId with email, password and document _id of admin
export const GET = async (request) => {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId") || "";
	const email = searchParams.get("email") || "";
    const password = searchParams.get("password") || "";
    
    try{
        if (!email) throw new Error("You must append ?email= query to URL")

        const adminUser = await User.findOne({ _id: userId, email, admin: true })
        
        if (!adminUser) {
            return NextResponse.json({
                success: false,
                message: `Failed to authenticate Admin`,
                errorMessage:  `User: ${email} does not exist or is not an admin`
            }, {
                status: 403
            })
        } 

        if (!password) throw new Error("You must append &password= query to URL") 

        // Return the userAuthId only if the correct password is supplied and user is an admin
        const passwordMatch = await bcrypt.compare(password, adminUser.adminPassword)

        if (passwordMatch) {
            const hashedId = await hash(adminUser.adminAuthId)
            const token = jwt.sign({ adminAuthId: hashedId }, process.env.JWT_SECRET, { expiresIn: '5h' })
            return NextResponse.json({
                success: true,
                message: `Successfully signed in as an admin`,
                data: {
                    adminAuthId: hashedId
                }
            },{ 
                status: 200,
                headers: {'Set-Cookie': `token=${token}`}
            });
        }

        throw new Error("User is unauthorized") 
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `An error occurred signing in as an  Admin`,
            errorMessage: err.message,
            error: err
        }, {
            status: 500
        })
    }
}

export const POST = async (request) => {
    const cookieStore = cookies()
    const token = cookieStore.get('token')
    console.log(`token: ${token}`)

    const headerList = headers()
    const { id, password } = await request.json()
    
    try{
        await isAdmin(headerList)
        
        const existingAdmin = await User.findOne({ _id: id, admin: true})
        
        if (existingAdmin) {
            const { _id, username, email, admin } = existingAdmin
            const hashedAdminId = await hash(existingAdmin.adminAuthId)
            return NextResponse.json({
                success: true,
                message: `User already admin, returning fetched user: ${existingAdmin.username}`,
                data: { 
                    _id,
                    username,
                    email,
                    admin,
                    adminAuthId: hashedAdminId
                }
            },{ 
                status: 200 
            })
        }
        
        // Generate a password used to get the adminAuthId in another route
        const hashedPassword = await hash(password)

        const newAdmin = await User.findByIdAndUpdate(id, {
            adminAuthId: generateUserAuthID(),
            admin: true,
            adminPassword: hashedPassword
        },{
            returnDocument: 'after'
        })

        const hashedAdminAuthId = await hash (newAdmin.adminAuthId)

        return NextResponse.json({
            success: true,
            message: `Successfully registered ${ newAdmin.username } as an Admin.`,
            data: {
                _id: newAdmin._id,
                username: newAdmin.username,
                email: newAdmin.email,
                admin: newAdmin.admin,
                adminAuthId: hashedAdminAuthId
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
    const headerList = headers()
    const searchParams = request.nextUrl.searchParams
    const deleteId = searchParams.get('deleteId') || ""

    try{
        if (!deleteId) throw new Error("You must append &deleteId= query to URL")

        await isAdmin(headerList)

        const adminExists = await User.findOne({ _id: deleteId, admin: true })

        if(!adminExists) throw new Error('User does not exist or is not an Admin.')

        await User.findByIdAndUpdate(deleteId, {
            adminAuthId: "",
            admin: false,
            adminPassword: ""
        })

        return NextResponse.json({
            success: true,
            message: "Admin sucessfully removed",
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