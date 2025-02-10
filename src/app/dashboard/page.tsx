"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import {
  Users,
  BookOpen,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/users/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Trophy className="mr-2 text-blue-500" />
            Quiz Progress
          </h2>
          <div className="h-64">
            <BarChart width={300} height={240} data={dashboardData?.workspaceProgress}>
              <Bar dataKey="completed" fill="#3B82F6" />
            </BarChart>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BookOpen className="mr-2 text-green-500" />
            Your Skills
          </h2>
          <div className="space-y-2">
            {dashboardData?.skills?.map((skill, index) => (
              <div key={index} className="bg-gray-100 px-4 py-2 rounded-md flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={16} />
                <p className="text-gray-700">{skill}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Friends Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="mr-2 text-purple-500" />
            Friends ({dashboardData?.friends?.length})
          </h2>
          <div className="space-y-3">
            {dashboardData?.friends?.map((friend, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="text-blue-500" size={20} />
                </div>
                <div>
                  <p className="font-medium">{friend.username}</p>
                  <p className="text-sm text-gray-500">{friend.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Clock className="mr-2 text-orange-500" />
          Recent Activity
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-3">Type</th>
                <th className="pb-3">Workspace</th>
                <th className="pb-3">Score</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData && dashboardData.recentSubmissions?.map((submission, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-4">
                    <p className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {submission.type}
                    </p>
                  </td>
                  <td className="py-4">{submission.workspace}</td>
                  <td className="py-4">{submission.score}%</td>
                  <td className="py-4">
                    {new Date(submission.date).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    {submission.passed ? (
                      <CheckCircle className="text-green-500" />
                    ) : (
                      <XCircle className="text-red-500" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;