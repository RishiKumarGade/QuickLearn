

import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import getWorkspaceInvitations from "@/helpers/getters/getInvitations"
connect()

export async function GET(request:NextRequest) {
    try {
        const userId = await getDataFromToken(request)
        const invitations = await getWorkspaceInvitations(userId);
            const response = NextResponse.json({
                message:'sessions found',
                invitations: invitations,
            })
            return response
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}
