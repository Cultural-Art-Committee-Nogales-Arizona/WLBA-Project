import { NextResponse } from "next/server"
import Festival from "@/models/events/Festivals"

//get either all festivals for display in the dashboard or calendar, or get closest festival
export const GET = async (request) => {
  const searchParams = request.nextUrl.searchParams
  const onlyNextEvent = searchParams.get('nextEvent') || ""
  
  try {
    const result = await Festival.find()

    function returnNextEvent(events) {
      // Find the first event whose date is larger then the current date
      return events.find(event => new Date(event.date) > new Date());
    }
    
    const nextEvent = returnNextEvent(result)
    
    // If query contains "nextEvent=true" it only returns the nextEvent
    // otherwise return all events
    let dataResponse = onlyNextEvent === "true" ? nextEvent : result

    return NextResponse.json({
      success: true,
      message: `Successfully fetched all festivals`,
      data: dataResponse || "No upcoming events"
    }, {
      status: 200
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({
      success: false,
      message: `An error occurred fetching Festivals`,
      errorMessage: err.message,
      error: err
    }, {
      status: 500
    })
  }
}

//add a festival to the database
export const POST = async (request) => {
  const { title, description, location, date, banner } = await request.json()
  
  try {
    const result = await Festival.create({
      title, 
      description, 
      location, 
      date, 
      banner
    })

    return NextResponse.json({
      success: true,
      message: `Successfully created festival ${title}`,
      data: result
    }, {
      status: 201
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `An error occurred creating Festival`,
      errorMessage: err.message,
      error: err
    }, {
      status: 500
    })
  }
}

//edit festival with _id
export const PUT = async (request) => {
  const searchParams = request.nextUrl.searchParams
  const festivalId = searchParams.get('festivalId') || ""
  const {title, description, location, date, banner} = await request.json()
  
  try{
    if (!festivalId) throw new Error("No festival id was defined")

    const festival = await Festival.findByIdAndUpdate(festivalId, {
      title, 
      description, 
      location, 
      date, 
      banner
    })

    return NextResponse.json({
      success: true,
      message: `Successfully Updated Festival ${title}'`,
      data: festival
    }, {
      status: 200
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `An error occurred updating Festival`,
      errorMessage: err.message,
      error: err
    }, {
      status: 500
    })
  }
}

//delete a festival with _id
export const DELETE = async (request) => {
  const searchParams = request.nextUrl.searchParams
  const festivalId = searchParams.get('festivalId') || ""
  
  try{
    await Festival.findByIdAndDelete(festivalId)

    return NextResponse.json({
      success: true,
      message: `Successfully deleted Festival ${festivalId}`
    }, {
      status: 204
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `An error occurred updating Festival`,
      errorMessage: err.message,
      error: err
    }, {
      status: 500
    })
  }
}