

import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import getRoadMapData from "@/helpers/getters/getRoadmapData"
import rejectFriendRequest  from "@/helpers/controllers/rejectFriendRequest";//+
import acceptWorkspaceInvite from "@/helpers/controllers/acceptWorkSpaceInvite";//+

connect()

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json();
        const { type,invitationId } = reqBody;
        
        if(type == "FRIEND"){
            rejectFriendRequest(invitationId);
        }else if(type=="MEMEBER"){
            acceptWorkspaceInvite(invitationId);
        }
        const response = NextResponse.json({
            message:'invite rejected',
        })
        return response
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}
