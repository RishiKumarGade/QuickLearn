

import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import getRoadMapData from "@/helpers/getters/getRoadmapData"
import { acceptFriendRequest } from "@/helpers/controllers/acceptFriendRequest";//+
import acceptWorkspaceInvite from "@/helpers/controllers/acceptWorkSpaceInvite";//+

connect()

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json();
        const { type,invitationId } = reqBody;
        if(type == "FRIEND"){
            await acceptFriendRequest(invitationId);
        }else if(type=="MEMBER"){
           await acceptWorkspaceInvite(invitationId);
        }
        const response = NextResponse.json({
            message:'invite accepted',
        })
        return response
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}
