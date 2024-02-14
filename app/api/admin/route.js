import User from "@/models/users/User";
import { NextResponse } from 'next/server';
import { generateUserAuthID, isAdmin, hash } from "@/utils/routeMethods";
import bcrypt from 'bcryptjs'
  
// Get a hashed adminAuthId with username, password and document _id of admin
export const GET = async (request) => {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId") || "";
	const username = searchParams.get("username") || "";
    const password = searchParams.get("password") || "";
    
    try{
        if (!username) throw new Error("You must append ?username= query to URL")

        const adminUser = await User.findOne({ _id: userId, username, admin: true })
        
        if (!adminUser) {
            return NextResponse.json({
                success: false,
                message: `Failed to authenticate Admin`,
                errorMessage:  `User: ${username} does not exist or is not an admin`
            }, {
                status: 403
            })
        } 

        if (!password) throw new Error("You must append &password= query to URL") 

        // Return the userAuthId only if the correct password is supplied and user is an admin
        const passwordMatch = await bcrypt.compare(password, adminUser.adminPassword)

        if (passwordMatch) {
            return NextResponse.json({
                success: true,
                message: `Successfully fetched ${username}`,
                data: {
                    adminAuthId: await hash(adminUser.adminAuthId)
                }
            },{ 
                status: 200
            });
        }

        throw new Error("User is unauthorized") 
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
	const userId = searchParams.get("userId") || "";
    const { id, password } = await request.json()
    
    try{
        if (!adminId) throw new Error("You must append ?adminId= query to URL")
        if (!userId) throw new Error("You must append &userId= query to URL")
        
        await isAdmin(userId, adminId)
        
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

        return NextResponse.json({
            success: true,
            message: `Successfully registered ${ newAdmin.username } as an Admin.`,
            data: {
                _id: newAdmin._id,
                username: newAdmin.username,
                email: newAdmin.email,
                admin: newAdmin.admin,
                adminAuthId: hash(newAdmin.adminAuthId)
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
    const adminId = searchParams.get('adminId') || ""
    const userId = searchParams.get('userId') || ""
    const deleteId = searchParams.get('deleteId') || ""

    try{
        if (!adminId) throw new Error("You must append ?adminId= query to URL")
        if (!userId) throw new Error("You must append &userId= query to URL")
        if (!deleteId) throw new Error("You must append &deleteId= query to URL")

        await isAdmin(userId, adminId)

        const adminExists = await User.findOne({ _id: deleteId, admin: true })

        if(!adminExists) throw new Error('User does not exist or is not an Admin.')

        const updatedUser = await User.findByIdAndUpdate(deleteId, {
            adminAuthId: "",
            admin: false,
            adminPassword: ""
        })

        return NextResponse.json({
            success: true,
            message: "Admin sucessfully removed",
            data: updatedUser
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