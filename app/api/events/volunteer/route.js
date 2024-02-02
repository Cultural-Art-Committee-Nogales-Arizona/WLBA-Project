import Volunteer from "@/models/vendors/Volunteer"

export const POST = async (request) => {
    const { name, phone, email, event } = await request.json()

    try {
        const alreadySignedUp = await Volunteer.find({ phone, event })

        if (alreadySignedUp) throw new Error(`User is already signed up for this event`)

        const newVolunteer = await Volunteer.create({
            name,
            phone,
            email,
            event
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

// Not necessary yet, will implement removing volunteers in the future
/* export const DELETE = async (request) => {
    const { name, phone, email, event } = await request.json()

    try {
        const alreadySignedUp = await Volunteer.find({ name, event })

        if (!alreadySignedUp) throw new Error(`User is not signed up for this event`)

        const newVolunteer = await Volunteer.create({
            name,
            phone,
            email,
            event
        })

        return NextResponse.json({
            success: true,
            message: `Successfully deleted registration for user: ${name} for event: ${event}`,
            data: newVolunteer
        }, {
            status: 204
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
} */


