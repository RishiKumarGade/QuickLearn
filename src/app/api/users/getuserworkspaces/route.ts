

import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import getRoadMapData from "@/helpers/getters/getRoadmapData"
import getUserWorkspaces from "@/helpers/getters/getUserWorkSpaces"
connect()


export async function GET(request:NextRequest) {
    try {
        const userId = await getDataFromToken(request)
        const wss = await getUserWorkspaces(userId);
            const response = NextResponse.json({
                message:'workspaces found',
                workspaces: wss,
            })
            return response
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}
