

import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import sendFriendRequest from "@/helpers/controllers/sendFriendRequest"
import sendWorkspaceInvite from "@/helpers/controllers/sendWorkspaceInvite"
connect()

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json();
        const { type,userId } = reqBody;
        if (type == "FRIEND"){
            await sendFriendRequest(userId);
        }else if (type == "MEMBER"){
            await sendWorkspaceInvite(userId);
        }
            const response = NextResponse.json({
                message:'sent',
            })
            return response
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}
