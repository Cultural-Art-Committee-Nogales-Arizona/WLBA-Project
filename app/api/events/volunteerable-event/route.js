import { Volunteer as VolunteerEvent } from "@/models/events/Volunteerable-Events"
import Volunteer from "@/models/events/Volunteer"
import { NextResponse } from "next/server"

export const GET = async (request) => {
    //Get all upcoming volunteer events for display in the calendar and admin dashboard
    const searchParams = request.nextUrl.searchParams
    const eventId = searchParams.get('eventId')

    try{
        let volunteers = await VolunteerEvent.find()

        volunteers = eventId ? volunteers : volunteers.find(obj => obj._id === eventId)

        return NextResponse.json({
            success: true,
            message: `Successfully fetched requested volunteer events`,
            data: volunteers
        }, {
            status: 200
        })
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: `An error occurred fetching volunteer events`,
            errorMessage: err.message,
            error: err
        }, {
            status: 500
        })
    }
}

export const POST = async (request) => {
    //Add volunteer event
    const { name, description, location, organizer, date } = await request.json();

	try {
		const result = await VolunteerEvent.create({
			name,
			description,
			location,
            organizer,
			date,
		});

		return NextResponse.json({
				success: true,
				message: `Successfully created event titled: ${name}`,
				data: result,
			},
			{ status: 201 }
		);
	} catch (err) {
		console.error(err);
		return NextResponse.json({
				success: false,
				message: `An error occurred creating event titled: ${name}`,
				errorMessage: err.message,
				error: err,
			},
			{ status: 500 }
		);
	}
}

export const PUT = async (request) => {
    //Edit volunteer event
    const searchParams = request.nextUrl.searchParams
    const eventId = searchParams.get('eventId')
    const { name, description, location, date } = await request.json()

    try {
		// If there is no eventId query then throw an error
		if (!eventId) throw new Error("No event _id was defined");

		const existingEvent = await VolunteerEvent.findById(eventId);

		// Check if event with given ID exists
		if (!existingEvent) throw new Error(`Event with _id ${eventId} not found`)

		const event = await VolunteerEvent.findByIdAndUpdate(eventId, {
			name,
			description,
			location,
			date,
		});

		return NextResponse.json({
				success: true,
				message: `Successfully Updated event with ID: ${eventId}'`,
				data: event,
			},
			{ status: 200 }
		);
	} catch (err) {
		console.error(err);
		return NextResponse.json({
				success: false,
				message: `An error occurred updating event with ID: ${eventId}`,
				errorMessage: err.message,
				error: err,
			},
			{ status: 500 }
		);
	}
}

export const DELETE = async (request) => {
    //Delete volunteer event
    const searchParams = request.nextUrl.searchParams;
	const eventId = searchParams.get("eventId");

	try {
		// If there is no eventId query then throw an error
		if (!eventId) throw new Error("No event id was defined")

		const existingEvent = await VolunteerEvent.findById(eventId)

		// Check if event with given ID exists
		if (!existingEvent) throw new Error(`Event with _id ${eventId} not found`)

		await VolunteerEvent.findByIdAndDelete(eventId)
        await Volunteer.deleteMany({event: eventId})

		return NextResponse.json({
				success: true,
				message: `Successfully deleted event with _id: ${eventId} and all registered volunteers`,
			},
			{ status: 200 }
		);
	} catch (err) {
		console.error(err);
		return NextResponse.json({
				success: false,
				message: `An error occurred deleting event with _id: ${eventId}`,
				errorMessage: err.message,
				error: err,
			},
			{ status: 500 }
		);
	}
}