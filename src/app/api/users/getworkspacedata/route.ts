

import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import getRoadMapData from "@/helpers/getters/getRoadmapData"

connect()

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json();
        const { workspaceId } = reqBody;
        const rmData = await getRoadMapData(workspaceId)
            const response = NextResponse.json({
                message:'Roadmap',
                roadmap: rmData,
            })
            return response
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}
