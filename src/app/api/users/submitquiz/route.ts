

import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import submitQuiz from "@/helpers/controllers/submitQuiz"
connect()

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json();
        const {QuizId,answers ,score} = reqBody;
        console.log(QuizId,answers,score);
       const userId = await getDataFromToken(request)
        await submitQuiz(QuizId,answers,score,userId)
            const response = NextResponse.json({
                message:'submitted',
            })
            return response
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}
