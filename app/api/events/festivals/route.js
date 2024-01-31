import { NextResponse } from "next/server"
import Festival from "@/models/events/Festivals"

//get either all festivals for display in the dashboard or calendar, or get closest festival
export const GET = async () => {
  try {
    const result = await Festival.find()

    return NextResponse.json({
      success: true,
      message: `Successfully fetched all festivals`,
      data: result
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `An error occurred fetching Festivals`,
      errorMessage: err.message,
      error: err
    })
  }
}

//add a festival
export async function POST(request) {
  try {
    const requestBody = await request.json()

    const result = await Festival.create(requestBody)

    return NextResponse.json({
      success: true,
      message: `Successfully created festival ${requestBody.title}`,
      data: result
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `An error occurred fetching Festivals`,
      errorMessage: err.message,
      error: err
    })
  }
}

//edit festival
export const PUT = () => {
}

//delete a festival
export const DELETE = () => {
}