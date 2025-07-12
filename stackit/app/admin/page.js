"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  MessageSquare, 
  MessageCircle, 
  Shield, 
  TrendingUp, 
  Calendar,
  Trash2,
  UserX,
  EyeOff,
  Crown,
  User
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [recentAnswers, setRecentAnswers] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
      return;
    }
    
    if (session.user.role !== "ADMIN") {
      router.push("/");
      return;
    }
    
    loadData();
  }, [session, status]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load stats
      const statsRes = await fetch("/api/admin/moderate?type=overview");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      
      // Load recent questions
      const questionsRes = await fetch("/api/admin/moderate?type=recent_questions");
      if (questionsRes.ok) {
        const questionsData = await questionsRes.json();
        setRecentQuestions(questionsData);
      }
      
      // Load recent answers
      const answersRes = await fetch("/api/admin/moderate?type=recent_answers");
      if (answersRes.ok) {
        const answersData = await answersRes.json();
        setRecentAnswers(answersData);
      }
      
      // Load users
      const usersRes = await fetch("/api/admin/moderate?type=users");
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
      
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (questionId) => {
    if (!confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      return;
    }
    
    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/moderate?questionId=${questionId}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        setRecentQuestions(prev => prev.filter(q => q.id !== questionId));
        alert("Question deleted successfully");
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Error deleting question");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteAnswer = async (answerId) => {
    if (!confirm("Are you sure you want to delete this answer? This action cannot be undone.")) {
      return;
    }
    
    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/moderate?answerId=${answerId}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        setRecentAnswers(prev => prev.filter(a => a.id !== answerId));
        alert("Answer deleted successfully");
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error deleting answer:", error);
      alert("Error deleting answer");
    } finally {
      setActionLoading(false);
    }
  };

  const toggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    const action = newRole === "ADMIN" ? "promote to admin" : "demote to user";
    
    if (!confirm(`Are you sure you want to ${action}?`)) {
      return;
    }
    
    try {
      setActionLoading(true);
      const response = await fetch("/api/admin/users/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole })
      });
      
      if (response.ok) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        alert(`User ${action} successfully`);
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Error updating user role");
    } finally {
      setActionLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading admin dashboard..." />
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-8 h-8 text-orange-500" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Moderate content and manage users</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Answers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAnswers}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Questions Today</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.questionsToday}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Answers Today</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.answersToday}</p>
                </div>
                <Calendar className="w-8 h-8 text-indigo-500" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Admin Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAdmins}</p>
                </div>
                <Shield className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview", icon: TrendingUp },
                { id: "questions", label: "Recent Questions", icon: MessageSquare },
                { id: "answers", label: "Recent Answers", icon: MessageCircle },
                { id: "users", label: "Users", icon: Users }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Questions Tab */}
            {activeTab === "questions" && (
              <div className="space-y-4">
                {recentQuestions.length === 0 ? (
                  <p className="text-gray-500">No recent questions found.</p>
                ) : (
                  recentQuestions.map(question => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{question.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            By {question.author.name || question.author.username} • {" "}
                            {new Date(question.createdAt).toLocaleDateString()} • {" "}
                            {question._count.answers} answers • {question._count.votes} votes
                          </p>
                        </div>
                        <button
                          onClick={() => deleteQuestion(question.id)}
                          disabled={actionLoading}
                          className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Answers Tab */}
            {activeTab === "answers" && (
              <div className="space-y-4">
                {recentAnswers.length === 0 ? (
                  <p className="text-gray-500">No recent answers found.</p>
                ) : (
                  recentAnswers.map(answer => (
                    <div key={answer.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            Answer to: {answer.question.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            By {answer.author.name || answer.author.username} • {" "}
                            {new Date(answer.createdAt).toLocaleDateString()} • {" "}
                            {answer._count.votes} votes
                          </p>
                          <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                            {answer.content.substring(0, 150)}...
                          </p>
                        </div>
                        <button
                          onClick={() => deleteAnswer(answer.id)}
                          disabled={actionLoading}
                          className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete answer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="space-y-4">
                {users.length === 0 ? (
                  <p className="text-gray-500">No users found.</p>
                ) : (
                  users.map(user => (
                    <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">
                              {user.name || user.username}
                            </h3>
                            {user.role === "ADMIN" && (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {user.email} • Joined {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {user._count.questions} questions • {user._count.answers} answers • {user._count.votes} votes
                          </p>
                        </div>
                        <button
                          onClick={() => toggleUserRole(user.id, user.role)}
                          disabled={actionLoading}
                          className={`ml-4 px-3 py-1 text-sm rounded-lg transition-colors ${
                            user.role === "ADMIN"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          }`}
                        >
                          {user.role === "ADMIN" ? (
                            <>
                              <User className="w-4 h-4 inline mr-1" />
                              Demote
                            </>
                          ) : (
                            <>
                              <Crown className="w-4 h-4 inline mr-1" />
                              Promote
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recent Activity</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        {stats?.questionsToday || 0} questions posted today
                      </p>
                      <p className="text-sm text-gray-600">
                        {stats?.answersToday || 0} answers posted today
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Platform Stats</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        {stats?.totalUsers || 0} total users
                      </p>
                      <p className="text-sm text-gray-600">
                        {stats?.totalAdmins || 0} administrators
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
