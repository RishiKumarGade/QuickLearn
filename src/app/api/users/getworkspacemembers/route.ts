

import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import getFriends from "@/helpers/getters/getFriends"
import getWorkSpaceMembers from "@/helpers/getters/getWorkSpaceMembers"

connect()

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json();
        const { workspaceId } = reqBody;
        const workspacemembers = await getWorkSpaceMembers(workspaceId)
            const response = NextResponse.json({
                message:'members found',
                workspacemembers: workspacemembers,
            })
            return response
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}
