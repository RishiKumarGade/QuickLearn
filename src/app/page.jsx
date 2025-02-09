"use client";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  X,
  ArrowLeft,
  Loader,
  MessageSquare,
  BookOpen,
  Users,
  Target,
  Layout,
  CheckCircle2,
  Brain,
} from "lucide-react";
import axios from "axios";
import { useRouter } from 'next/navigation'

const WorkspaceLayout = () => {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [openSections, setOpenSections] = useState([]);
  const [workspaces, setWorkSpaces] = useState([]);
  const [friends, setFriends] = useState([]);
  const router = useRouter()
  const [currentModule, setCurrentModule] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [workspaceType, setWorkspaceType] = useState("SKILL");
  const [workspacePrompt, setWorkspacePrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWorkSpaceLoading, setIsWorkSpaceLoading] = useState(false);

  // Derive current workspace from workspaces array
  const currentWorkspace = workspaces.find((ws) => ws._id === selectedWorkspaceId);

  useEffect(() => {
    getUserWorkSpaces();
    getFriends();
  }, []);

  const getFriends = async ()=>{
    axios.get('/api/users/getfriends').then((res)=>{
      setFriends(res.data.friends);
    })
  }

 const  sendWorkspaceInvite = async(e,receiverId,workspaceId)=>{
  e.preventDefault();
  axios.post('/api/users/sendinvite',{type:"MEMBER",receiverId,workspaceId})
 }
  // Fetch user workspaces
  const getUserWorkSpaces = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/users/getuserworkspaces");
      const wses = res.data.workspaces.map((ws) => ({
        ...ws,
        members: ws.members || [],
        roadmap: ws.roadmap || [],
      }));
      setWorkSpaces(wses);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch roadmap data
  const getRoadMapData = async () => {
    try {
      setIsWorkSpaceLoading(true);
      const res = await axios.post("/api/users/getworkspacedata", {
        workspaceId: selectedWorkspaceId,
      });

      if (!res.data?.roadmap?.learningModule) {
        console.error("Invalid response format:", res.data);
        return;
      }

      setWorkSpaces((prev) =>
        prev.map((ws) =>
          ws._id === selectedWorkspaceId
            ? { ...ws, roadmap: res.data.roadmap.learningModule }
            : ws
        )
      );
    } catch (error) {
      console.error("Error fetching roadmap data:", error);
    } finally {
      setIsWorkSpaceLoading(false);
    }
  };

  // Fetch workspace members
  const getWorkSpaceMembers = async () => {
    try {
      const res = await axios.post("/api/users/getworkspacemembers", {
        workspaceId: selectedWorkspaceId,
      });
      setWorkSpaces((prev) =>
        prev.map((ws) =>
          ws._id === selectedWorkspaceId
            ? { ...ws, members: res.data.members }
            : ws
        )
      );
    } catch (error) {
      console.error("Error fetching workspace members:", error);
    }
  };

  // Handle workspace creation
  const handleCreateWorkspace = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/users/createworkspace", {
        prompt: workspacePrompt,
        type: workspaceType,
      });
      setWorkSpaces((prev) => [...prev, res.data]);
      setSelectedWorkspaceId(res.data._id);
      window.location.reload();
    } catch (error) {
      console.error("Error creating workspace:", error);
    } finally {
      setIsLoading(false);
    }
  };

    const toggleSection = (section) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };
  const handleQuizSubmit = async () => {
    if (!quizAnswers) {
      console.error("Quiz answers are missing.");
      return;
    }
  
    setIsLoading(true);
    try {
      const updatedWorkspaces = workspaces.map((ws) => {
        if (ws._id === selectedWorkspaceId) {
          const updatedRoadmap = ws.roadmap.map((module, index) => {
            if (index === currentModule && module.quiz) {
              const totalQuestions = module.quiz.questions?.length || 0;
              const correctAnswers = module.quiz.answers?.filter((a, i) => a == quizAnswers[i][0]).length || 0;
              const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
              axios.post('/api/users/submitquiz',{QuizId:module.quiz._id,answers:quizAnswers,score:score})
              return {
                ...module,
                quiz: {
                  ...module.quiz,
                  isCompleted: score >= 75,
                },
              };
            }

            return module;
          });


  
          return { ...ws, roadmap: updatedRoadmap };
        }
        return ws;
      });
  
      setWorkSpaces(updatedWorkspaces); // Fixed function name
      setQuizSubmitted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  // Handle slide navigation
  const handleSlideNavigation = (direction) => {
    if (!currentWorkspace || !currentWorkspace.roadmap) return;

    const module = currentWorkspace.roadmap[currentModule];
    if (direction === "next" && currentSlide < module.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (direction === "prev" && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Check if a module can be accessed
  const canAccessModule = (moduleIndex) => {
    if (!currentWorkspace || !currentWorkspace.roadmap) return false;
    if (moduleIndex === 0) return true;
    const previousModule = currentWorkspace.roadmap[moduleIndex - 1];
    return previousModule.quiz.isCompleted;
  };

  // Check if quiz should be shown
  const showQuiz = (moduleIndex) => {
    if (!currentWorkspace || !currentWorkspace.roadmap) return false;
    const module = currentWorkspace.roadmap[moduleIndex];
    return (
      currentSlide === module.slides.length - 1 && !module.quiz.isCompleted
    );
  };

  // Fetch roadmap and members when workspace is selected
  useEffect(() => {
    if (selectedWorkspaceId) {
      const workspace = workspaces.find((ws) => ws._id === selectedWorkspaceId);
      if (workspace && (!workspace.roadmap || workspace.roadmap.length === 0)) {
        getRoadMapData();
      }
      if (workspace && (!workspace.members || workspace.members.length === 0)) {
        getWorkSpaceMembers();
      }
    }
  }, [selectedWorkspaceId]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Left Sidebar - Workspaces */}
      <div className="w-1/4 bg-black/40 backdrop-blur-xl p-4 overflow-y-auto border-r border-white/10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Layout className="text-purple-400" size={24} />
            <h2 className="text-xl font-bold text-white">Workspaces</h2>
          </div>
          <button
            onClick={() => setSelectedWorkspaceId(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all border border-purple-500/50"
          >
            <MessageSquare size={18} />
            <p>AI Chat</p>
          </button>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader className="animate-spin text-blue-400" />
          </div>
        ) : (
          workspaces.map((ws) => (
            <div
              key={ws._id}
              onClick={() => setSelectedWorkspaceId(ws._id)}
              className={`p-4 mb-3 rounded-lg cursor-pointer transition-all transform hover:scale-102 border
                ${
                  selectedWorkspaceId === ws._id
                    ? "bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/20"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
            >
              <h3 className="text-white font-semibold flex items-center gap-2">
                {ws.type === "SKILL" ? (
                  <Brain size={18} className="text-blue-400" />
                ) : (
                  <Target size={18} className="text-green-400" />
                )}
                {ws.title}
              </h3>
              <div className="flex items-center mt-3">
                <div className="w-full bg-black/30 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
                    style={{ width: `${ws.progress}%` }}
                  ></div>
                </div>
                <p className="text-white text-sm ml-2">{ws.progress}%</p>
              </div>
              <p className="text-gray-400 text-sm mt-2 flex items-center gap-2">
                {ws.type === "SKILL" ? (
                  <BookOpen size={14} />
                ) : (
                  <Users size={14} />
                )}
                {ws.type === "SKILL" ? "Skill Development" : "Project Team"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {currentWorkspace ? (
          <>
            {!isWorkSpaceLoading ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={() => setSelectedWorkspaceId(null)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all border border-white/10"
                  >
                    <ArrowLeft size={18} />
                    Back to Create Workspace
                  </button>
                  <button
                    onClick={() => setShowRightPanel(!showRightPanel)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all border border-blue-500/50"
                  >
                    {showRightPanel ? <X size={18} /> : <Users size={18} />}
                    {showRightPanel ? "Hide Details" : "Show Details"}
                  </button>
                </div>

                {/* Collapsible Sections */}
                <div className="space-y-4">
                  {["Roadmap", "Learning Modules", "Mock Tests"].map(
                    (section) => (
                      <div
                        key={section}
                        className="bg-white/5 backdrop-blur-xl rounded-lg shadow-lg overflow-hidden border border-white/10"
                      >
                        <button
                          onClick={() => toggleSection(section)}
                          className="w-full flex justify-between items-center p-4 hover:bg-white/5 transition-all text-white"
                        >
                          <p className="font-semibold flex items-center gap-2">
                            {section === "Roadmap" && (
                              <Target size={18} className="text-blue-400" />
                            )}
                            {section === "Learning Modules" && (
                              <BookOpen size={18} className="text-purple-400" />
                            )}
                            {section === "Mock Tests" && (
                              <Brain size={18} className="text-green-400" />
                            )}
                            {section}
                          </p>
                          {openSections.includes(section) ? (
                            <ChevronUp className="text-gray-400" />
                          ) : (
                            <ChevronDown className="text-gray-400" />
                          )}
                        </button>

                        {openSections.includes(section) && (
                          <div className="p-4 border-t border-white/10">
                            {section === "Roadmap" && currentWorkspace.roadmap && (
                              <div className="space-y-3">
                                {currentWorkspace.roadmap.map((module, index) => (
                                  <div
                                    key={index}
                                    className="p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center"
                                  >
                                    <p className="text-white">{module.title}</p>
                                    {module.quiz.isCompleted && (
                                      <p className="text-green-400 text-sm flex items-center gap-1">
                                        <CheckCircle2 size={14} />
                                        Completed
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {section === "Learning Modules" && currentWorkspace.roadmap && (
                              <div className="space-y-4">
                                {currentWorkspace.roadmap.map((module, index) => (
                                  <div
                                    key={index}
                                    className="border border-white/10 rounded-lg p-4 bg-white/5"
                                  >
                                    <div className="flex justify-between items-center">
                                      <h3 className="font-medium text-white flex items-center gap-2">
                                        <BookOpen
                                          size={18}
                                          className="text-purple-400"
                                        />
                                        {module.title}
                                      </h3>
                                      {!canAccessModule(index) ? (
                                        <p className="text-red-400 text-sm flex items-center gap-1">
                                          <X size={14} />
                                          Complete previous module first
                                        </p>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            if (currentModule === index) {
                                              setCurrentModule(null);
                                              setCurrentSlide(0);
                                              setQuizSubmitted(false);
                                              setQuizAnswers({});
                                            } else {
                                              setCurrentModule(index);
                                              setCurrentSlide(0);
                                              setQuizSubmitted(false);
                                              setQuizAnswers({});
                                            }
                                          }}
                                          className="text-blue-400 hover:text-blue-300 transition-all"
                                          disabled={!canAccessModule(index)}
                                        >
                                          {currentModule === index
                                            ? "Close"
                                            : "Open"}
                                        </button>
                                      )}
                                    </div>

                                    {currentModule === index &&
                                      canAccessModule(index) && (
                                        <div className="mt-4">
                                          {/* Slide Navigation */}
                                          <div className="flex justify-between items-center mb-4 bg-black/20 p-3 rounded-lg">
                                            <button
                                              onClick={() =>
                                                handleSlideNavigation("prev")
                                              }
                                              disabled={currentSlide === 0}
                                              className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
                                            >
                                              Previous
                                            </button>
                                            <p className="text-white">
                                              Slide {currentSlide + 1} of{" "}
                                              {module.slides.length}
                                            </p>
                                            <button
                                              onClick={() =>
                                                handleSlideNavigation("next")
                                              }
                                              disabled={
                                                currentSlide ===
                                                module.slides.length - 1
                                              }
                                              className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
                                            >
                                              Next
                                            </button>
                                          </div>

                                          {/* Slide Content */}
                                          <div className="bg-white/5 p-6 rounded-lg mb-4 border border-white/10">
                                            <p className="text-white">
                                              {module.slides[currentSlide]}
                                            </p>
                                          </div>

                                          {/* Quiz Section */}
                                          {showQuiz(index) && (
                                            <div className="border-t border-white/10 pt-4">
                                              <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                                                <Brain
                                                  size={18}
                                                  className="text-purple-400"
                                                />
                                                Module Quiz
                                              </h4>
                                              {module.quiz.questions.map(
                                                (q, qIndex) => (
                                                  <div
                                                    key={qIndex}
                                                    className="mb-6 bg-white/5 p-4 rounded-lg border border-white/10"
                                                  >
                                                    <p className="font-medium text-white mb-3">
                                                      {q.question}
                                                    </p>
                                                    <div className="space-y-2">
                                                      {q.choices.map(
                                                        (choice, cIndex) => (
                                                          <label
                                                            key={cIndex}
                                                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-all"
                                                          >
                                                            <input
                                                              type="radio"
                                                              name={`question-${qIndex}`}
                                                              onChange={() =>
                                                                setQuizAnswers({
                                                                  ...quizAnswers,
                                                                  [qIndex]: choice,
                                                                })
                                                              }
                                                              disabled={
                                                                quizSubmitted
                                                              }
                                                              className="text-purple-500 focus:ring-purple-500"
                                                            />
                                                            <p className="text-gray-300">
                                                              {choice}
                                                            </p>
                                                          </label>
                                                        )
                                                      )}
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                              <button
                                                onClick={handleQuizSubmit}
                                                disabled={
                                                  quizSubmitted ||
                                                  isLoading ||
                                                  Object.keys(quizAnswers)
                                                    .length !==
                                                    module.quiz.questions.length
                                                }
                                                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                              >
                                                {isLoading ? (
                                                  <Loader className="animate-spin" />
                                                ) : quizSubmitted ? (
                                                  <>
                                                    <CheckCircle2 size={18} />
                                                    Quiz Submitted
                                                  </>
                                                ) : (
                                                  <>
                                                    <Brain size={18} />
                                                    Submit Quiz
                                                  </>
                                                )}
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : (
              <Loader className="animate-spin" />
            )}
          </>
        ) : (
          <div className="max-w-2xl mx-auto mt-20">
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-lg shadow-lg border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <Layout className="text-purple-400" />
                Create New Workspace
              </h2>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">
                  What do you want to do?
                </label>
                <input
                  type="text"
                  value={workspacePrompt}
                  onChange={(e) => setWorkspacePrompt(e.target.value)}
                  placeholder="e.g., Learn Python, Build a climate app..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">
                  Workspace Type
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setWorkspaceType("SKILL")}
                    className={`flex-1 px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2
                      ${
                        workspaceType === "SKILL"
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                          : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                      }`}
                  >
                    <Brain size={18} />
                    Learn a Skill
                  </button>
                  <button
                    onClick={() => setWorkspaceType("PROJECT")}
                    className={`flex-1 px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2
                      ${
                        workspaceType === "PROJECT"
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                          : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                      }`}
                  >
                    <Target size={18} />
                    Start a Project
                  </button>
                </div>
              </div>

              <button
                onClick={handleCreateWorkspace}
                disabled={isLoading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  <>
                    <Layout size={18} />
                    Create Workspace
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel */}
      {currentWorkspace && showRightPanel && (
        <div className="w-1/4 bg-black/40 backdrop-blur-xl p-4 text-white border-l border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="text-blue-400" />
              Workspace Details
            </h2>
            <button
              onClick={() => setShowRightPanel(false)}
              className="text-gray-400 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3 text-gray-400">Members</h3>
              <div className="space-y-2">
                {currentWorkspace.members && currentWorkspace.members.map((member, index) => (
                  <div
                    key={index}
                    className="bg-white/5 p-3 rounded-lg border border-white/10 flex items-center gap-2"
                  >
                    <Users size={14} className="text-blue-400" />
                    {member}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-gray-400">Progress</h3>
              <div className="h-2 bg-black/30 rounded-full">
                <div
                  className="h-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                  style={{ width: `${currentWorkspace.progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm flex items-center gap-2">
                <Target size={14} className="text-blue-400" />
                {currentWorkspace.progress}% Complete
              </p>
            </div>
            <div>
              <h3>Invite others</h3>
              {friends &&
          friends.map((friend) => {
            const isMember = currentWorkspace?.members?.some(
              (member) => member._id == friend._id || false
            );
            console.log(friend)
            return (
              <div key={friend._id}>
                {friend.username} {isMember ? "Already A member" : <> 
                <button onClick={(e)=>{sendWorkspaceInvite(e,friend._id,currentWorkspace._id);}} >send invite</button>
                 </>}
              </div>
            );
          })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceLayout;
