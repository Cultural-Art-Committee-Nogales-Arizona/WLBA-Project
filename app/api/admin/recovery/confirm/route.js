import { NextResponse } from "next/server"
import Token from "@/models/users/Recovery"
import User from "@/models/users/User"

export const POST = async (request) => {
    const { password, token } = await request.json()
}