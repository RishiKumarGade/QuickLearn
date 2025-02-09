

import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import getFriends from "@/helpers/getters/getFriends"
connect()

export async function GET(request:NextRequest) {
    try {
        const userId = await getDataFromToken(request)
        const friends = await getFriends(userId);
            const response = NextResponse.json({
                message:'sessions found',
                friends: friends,
            })
            return response
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}
