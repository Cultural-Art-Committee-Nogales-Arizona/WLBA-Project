import Volunteer from "@/models/vendors/Volunteer"

export const POST = async (request) => {
    const { name, phone, email, event } = await request.json()

    try {
        const newVolunteer = await Volunteer.create({
            name,
            phone,
            email,
            event
        })

        return NextResponse.json({
            success: true,
            message: `Successfully regitered ${name} for event`,
            data: result
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