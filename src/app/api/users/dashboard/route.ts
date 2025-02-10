import mongoose from "mongoose";
import User from '@/models/userModel';
import Quiz from '@/models/quizModel'; // Ensure this is the correct path
import WorkSpace from '@/models/workspaceModel';
import QuizSubmission from '@/models/quizsubmissionModel';
import Friend from '@/models/friendModel';
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import RoadMap from '@/models/roadmapModel';

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    console.log(mongoose.modelNames());
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const workspaces = await WorkSpace.find({ ownerId: userObjectId });

    const roadmaps = await RoadMap.find({ workspaceId: { $in: workspaces.map(ws => ws._id) } })
      .populate({
        path: 'learningModule.quiz',
        model: 'quizzes'
      });

      const workspaceProgress = await Promise.all(workspaces.map(async (ws) => {
        const roadmap = roadmaps.find((rm) => rm.workspaceId.equals(ws._id));
        if (!roadmap) {
          return {
            name: ws.title,
            total: 0,
            completed: 0,
            progress: 0 // Ensures consistency
          };
        }
      
        const quizIds = roadmap.learningModule.map(mod => mod.quiz?._id).filter(Boolean);
      
        const submissions = await QuizSubmission.find({
          userId: userObjectId,
          QuizId: { $in: quizIds },
          score: { $gte: 75 }
        });
      
        const total = quizIds.length;
        const completed = submissions.length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      
        return {
          name: ws.title,
          total,
          completed,
          progress
        };
      }));
      

    // Get friends
    const friends = await Friend.find({
      $or: [{ user1: userObjectId }, { user2: userObjectId }]
    }).populate('user1 user2');

    const friendList = friends.map(f => 
      f.user1._id.equals(userObjectId) ? f.user2 : f.user1
    );

    // Get recent submissions
    const recentSubmissions = await QuizSubmission.find({ userId: userObjectId })
      .sort({ submissionTime: -1 })
      .limit(5)
      .populate({
        path: 'QuizId',
        model: 'quizzes' // Ensure correct model name
      });

    // Map recent submissions to include workspace titles
    const submissionData = recentSubmissions.map(sub => {
      // Find the roadmap containing this quiz
      const roadmap = roadmaps.find(rm => 
        rm.learningModule.some(mod => mod.quiz?._id?.equals(sub.QuizId._id))
      );

      const workspaceTitle = roadmap?.workspaceId?.title || 'Unknown';

      return {
        type: 'quizzes',
        workspace: workspaceTitle,
        score: sub.score,
        date: sub.submissionTime,
        passed: sub.score >= 75
      };
    });

    // Get user skills
    const user = await User.findById(userObjectId);
    const skills = user?.skillTags || [];

    return NextResponse.json({
      message: "Dashboard data fetched successfully",
      success: true,
      skills,
      friends: friendList,
      workspaceProgress,
      recentSubmissions: submissionData
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: error.message || error }, { status: 500 });
  }
}
