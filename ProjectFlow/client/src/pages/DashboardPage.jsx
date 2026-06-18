import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

const DashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get('/dashboard/stats');
        setStats(data.data);
      } catch(err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  const completedTasks = stats.tasksByStatus?.['Completed'] || 0;
  const pendingTasks = (stats.tasksByStatus?.['Pending'] || 0) + (stats.tasksByStatus?.['In Progress'] || 0);
  const projectsInProgress = stats.projectsByStatus?.['In Progress'] || 0;
  const completionPercentage = stats.totalTasks > 0 ? Math.round((completedTasks / stats.totalTasks) * 100) : 0;

  // Format data for PieChart
  const projectStatusData = Object.keys(stats.projectsByStatus || {}).map(key => ({
    name: key,
    value: stats.projectsByStatus[key]
  }));

  // Format data for BarChart
  const taskStatusData = Object.keys(stats.tasksByStatus || {}).map(key => ({
    name: key,
    Tasks: stats.tasksByStatus[key]
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Dashboard</h1>
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <div className="text-sm font-medium text-slate-500">Total Projects</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{stats.totalProjects}</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <div className="text-sm font-medium text-slate-500">Total Tasks</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{stats.totalTasks}</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <div className="text-sm font-medium text-slate-500">Completed Tasks</div>
          <div className="mt-2 text-3xl font-bold text-green-600">{completedTasks}</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <div className="text-sm font-medium text-slate-500">Pending Tasks</div>
          <div className="mt-2 text-3xl font-bold text-orange-500">{pendingTasks}</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <div className="text-sm font-medium text-slate-500">Projects In Progress</div>
          <div className="mt-2 text-3xl font-bold text-blue-600">{projectsInProgress}</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <div className="text-sm font-medium text-slate-500">Completion %</div>
          <div className="mt-2 text-3xl font-bold text-indigo-600">{completionPercentage}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Project Status Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Project Status</h2>
          {projectStatusData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">No project data available</div>
          )}
        </div>

        {/* Task Completion Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Task Completion</h2>
          {taskStatusData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskStatusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="Tasks" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">No task data available</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Deadlines Panel */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
            <span>Alerts & Deadlines</span>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {stats.overdueTasks} Overdue Tasks
            </span>
          </h2>
          <div className="text-sm text-slate-600">
            {stats.overdueTasks > 0 ? (
              <p>You have {stats.overdueTasks} tasks that are overdue. Please check your Tasks page to address them.</p>
            ) : (
              <p className="flex items-center text-green-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                You're all caught up! No overdue tasks.
              </p>
            )}
          </div>
        </div>

        {/* Productivity Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Productivity Overview</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span className="text-slate-700">Task Completion Rate</span>
                <span className="text-indigo-600">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
