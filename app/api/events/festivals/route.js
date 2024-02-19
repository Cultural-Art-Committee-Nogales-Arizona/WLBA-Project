import { NextResponse } from "next/server";
import Festival from "@/models/events/Festivals";
import { isAdmin, deleteImage } from "@/utils/routeMethods";
import cloudinary from '@/connections/cloudinary';

// get either all festivals for display in the dashboard or calendar, or get closest festival
export const GET = async (request) => {
	const searchParams = request.nextUrl.searchParams;
	const onlyNextEvent = searchParams.get("nextEvent") || "";

	try {
		const result = await Festival.find().sort({ start: 1 })

		function returnNextEvent(events) {
			// Find the first event whose date is larger then the current date
			const rightNow = new Date();
			return events.find((event) => new Date(event.start) > rightNow);
		}

		const nextEvent = returnNextEvent(result);

		// If query contains "nextEvent=true" it only returns the next event
		// otherwise return all events
		const dataResponse = onlyNextEvent === "true" ? nextEvent : result;

		return NextResponse.json({
				success: true,
				message: `Successfully fetched all festivals`,
				data: dataResponse || "No upcoming events",
			},
			{ status: 200 }
		);
	} catch (err) {
		console.error(err);
		return NextResponse.json({
				success: false,
				message: `An error occurred fetching Festivals`,
				errorMessage: err.message,
				error: err,
			},
			{ status: 500 }
		);
	}
};

// add a festival to the database
export const POST = async (request) => {
	const searchParams = request.nextUrl.searchParams;
	const adminId = searchParams.get("adminId") || "";
	const userId = searchParams.get("userId") || "";
	const { title, description, location, start, end, images } = await request.json();

	try {
		// ! Uncomment line when ready to only allow admins
		/* 
		if (!adminId) throw new Error("You must append ?adminId= query to URL")
		if (!userId) throw new Error("You must append &userId= query to URL")
        
		await isAdmin(userId, adminId) 
		*/

		const result = await Festival.create({
			title,
			description,
			location,
			start,
			end,
			images
		});

		return NextResponse.json({
				success: true,
				message: `Successfully created festival titled: ${title}`,
				data: result,
			},
			{ status: 201 }
		);
	} catch (err) {
		console.error(err);
		return NextResponse.json({
				success: false,
				message: `An error occurred creating Festival titled: ${title}`,
				errorMessage: err.message,
				error: err,
			},
			{ status: 500 }
		);
	}
};

// edit festival with _id
export const PUT = async (request) => {
	const searchParams = request.nextUrl.searchParams;
	const festivalId = searchParams.get("festivalId") || "";
	const adminId = searchParams.get("adminId") || "";
	const userId = searchParams.get("userId") || "";
	const { title, description, location, start, end, images } = await request.json();

	try {
		// ! Uncomment line when ready to only allow admins
		/* 
		if (!adminId) throw new Error("You must append ?adminId= query to URL")
		if (!userId) throw new Error("You must append &userId= query to URL")
        
		await isAdmin(userId, adminId) 
		*/

		// If there is no festivalId query then throw an error
		if (!festivalId) throw new Error("No Festival _id was defined");

		const existingFestival = await Festival.findById(festivalId);

		// Check if festival with given ID exists
		if (!existingFestival) throw new Error(`Festival with _id ${festivalId} not found`)

		const festival = await Festival.findByIdAndUpdate(festivalId, {
			title,
			description,
			location,
			start,
			end,
			images
		},{
				returnDocument: 'after'
		});

		return NextResponse.json({
				success: true,
				message: `Successfully Updated Festival titled: ${title}'`,
				data: festival,
			},
			{ status: 200 }
		);
	} catch (err) {
		console.error(err);
		return NextResponse.json({
				success: false,
				message: `An error occurred updating Festival titled: ${title}`,
				errorMessage: err.message,
				error: err,
			},
			{ status: 500 }
		);
	}
};

// delete a festival with _id
export const DELETE = async (request) => {
	const searchParams = request.nextUrl.searchParams;
	const festivalId = searchParams.get("festivalId") || "";
	const adminId = searchParams.get("adminId") || "";
	const userId = searchParams.get("userId") || "";

	try {
		// ! Uncomment line when ready to only allow admins
		/* 
		if (!adminId) throw new Error("You must append ?adminId= query to URL")
		if (!userId) throw new Error("You must append &userId= query to URL")
        
		await isAdmin(userId, adminId) 
		*/

		// If there is no festivalId query then throw an error
		if (!festivalId) throw new Error("You must append &festivalId= query to URL");

		const existingFestival = await Festival.findById(festivalId);

		// Check if festival with given ID exists
		if (!existingFestival) throw new Error(`Festival with _id ${festivalId} not found`);

		await Festival.findByIdAndDelete(festivalId);

		/* ---------------------- Delete images off Cloudinary ---------------------- */

		// const imagePublicIds = existingFestival.images.map(image => image.publicId);

		existingFestival.images.map(async (imageURL) => {
			try {

				await deleteImage(imageURL)
			} catch (error) {
				console.error(error)
			}
		})

		/* -------------------------------------------------------------------------- */		

		return NextResponse.json({
				success: true,
				message: `Successfully deleted Festival with title: ${existingFestival.title}`,
			},
			{ status: 200 }
		);
	} catch (err) { 
		console.error(err);
		return NextResponse.json({
				success: false,
				message: `An error occurred deleting Festival with _id: ${festivalId}`,
				errorMessage: err.message,
				error: err,
			},
			{ status: 500 }
		);
	}
};
