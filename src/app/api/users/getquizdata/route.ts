

import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import getRoadMapData from "@/helpers/getters/getRoadmapData"
import Quiz from "@/models/quizModel";
import QuizSubmission from "@/models/quizsubmissionModel";

connect()

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json();
        const { QuizId } = reqBody;
        const userId = getDataFromToken(request)
        const qsub = await QuizSubmission.findOne({userId:userId, QuizId: QuizId}).populate('QuizId');
            const response = NextResponse.json({
                message:'Roadmap',
                quizdata: qsub != null ? qsub : null ,
            })
            return response
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}
