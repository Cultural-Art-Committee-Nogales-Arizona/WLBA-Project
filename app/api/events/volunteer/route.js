import Volunteer from "@/models/events/Volunteer"
import { NextResponse } from "next/server"

export const GET = async (/* request */) => {
    try{
        const volunteers = await Volunteer.find()

        return NextResponse.json({
            success: true,
            message: `Found Volunteers`,
            data: volunteers 
        })
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `An error occurred fetching volunteers`,
            errorMessage: err.message,
            error: err
        }, {
            status: 500
        })
    }
}

export const POST = async (request) => {
    const { name, phone, email, interest } = await request.json()

    try {
        const alreadySignedUp = await Volunteer.findOne({ phone })

        if (alreadySignedUp) throw new Error(`User is already signed up for this event`)
        
        const newVolunteer = await Volunteer.create({
            name,
            phone,
            email,
            interest
        })

        return NextResponse.json({
            success: true,
            message: `Successfully registered ${name} for event`,
            data: newVolunteer
        }, {
            status: 201
        })
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `An error occurred registering volunteer`,
            errorMessage: err.message,
            error: err
        }, {
            status: 500
        })
    }
}

export const DELETE = async (request) => {
    const searchParams = request.nextUrl.searchParams
    const volunteerId = searchParams.get('volunteerId')

    try {
        const existingVolunteer = await Volunteer.findById(volunteerId);

        if(!existingVolunteer) throw new Error('Volunteer does not exist')

        await Volunteer.findByIdAndDelete(volunteerId)
        
        return NextResponse.json({
            success: true,
            message: `Successfully deleted registration for user: ${existingVolunteer.name}`,
        }, {
            status: 200
        })
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `An error occurred deleting volunteer registration`,
            errorMessage: err.message,
            error: err
        }, {
            status: 500
        })
    }
}


