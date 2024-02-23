"use server"

import { cookies } from "next/headers"

async function clearToken (data) {
    console.log('token clear functionc alled')
    cookies().set({
        name: 'token',
        value: '',
        expires: new Date('2016-10-05'),
        path: '/', // For all paths
    })
}

export default clearToken