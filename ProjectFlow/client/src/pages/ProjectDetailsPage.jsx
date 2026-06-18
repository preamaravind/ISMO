import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#10b981', '#4f46e5', '#f59e0b', '#ef4444', '#64748b'];

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await axiosInstance.get(`/projects/${id}`);
        setProject(data.data);
      } catch(err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-slate-800">Project Not Found</h2>
        <Link to="/projects" className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block">&larr; Back to Projects</Link>
      </div>
    );
  }

  // Calculate stats
  const tasks = project.tasks || [];
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const progressPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const taskStatusData = [
    { name: 'Completed', value: completedTasks },
    { name: 'In Progress', value: inProgressTasks },
    { name: 'Pending', value: pendingTasks }
  ].filter(d => d.value > 0);

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/projects" className="text-slate-400 hover:text-indigo-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </Link>
          <h1 className="text-3xl font-bold text-slate-800">{project.project_name}</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            project.status === 'Completed' ? 'bg-green-100 text-green-800' : 
            project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
          }`}>
            {project.status || 'Not Started'}
          </span>
        </div>
        <div className="text-sm text-slate-500 font-medium bg-white px-4 py-2 rounded-md border border-slate-200 shadow-sm">
          {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'No Start'} &rarr; {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'TBD'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Project Info & Progress */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Project Overview</h2>
          <p className="text-slate-600 mb-8 leading-relaxed whitespace-pre-wrap">
            {project.description || 'No description provided for this project.'}
          </p>
          
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="block text-sm font-medium text-slate-500 mb-1">Overall Progress</span>
                <span className="text-3xl font-bold text-slate-900">{progressPercentage}%</span>
              </div>
              <div className="text-sm text-slate-500 font-medium">
                {completedTasks} of {tasks.length} tasks completed
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div className="bg-indigo-600 h-3 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        </div>

        {/* Task Analytics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Task Analytics</h2>
          <div className="flex-1 min-h-[200px]">
            {taskStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                <p>No task data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task List / Timeline View */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Task List & Timeline</h2>
          <Link to="/tasks" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-white px-3 py-1.5 rounded-md border border-slate-300 shadow-sm transition-colors">
            Manage Tasks
          </Link>
        </div>
        
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No tasks have been created for this project yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {tasks.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {t.status === 'Completed' ? (
                          <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 mr-3"></div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-slate-900">{t.task_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        t.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        t.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        t.priority === 'High' ? 'bg-red-100 text-red-800' : 
                        t.priority === 'Low' ? 'bg-slate-100 text-slate-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {t.due_date ? new Date(t.due_date).toLocaleDateString() : 'No due date'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Activity History */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
        </div>
        <div className="p-6">
          {tasks.length > 0 ? (
            <div className="flow-root">
              <ul className="-mb-8">
                {tasks.slice(0, 5).map((t, tIdx) => (
                  <li key={t.id}>
                    <div className="relative pb-8">
                      {tIdx !== Math.min(tasks.length, 5) - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true"></span>
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            t.status === 'Completed' ? 'bg-green-500' : 'bg-indigo-500'
                          }`}>
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-slate-500">
                              Task <span className="font-medium text-slate-900">{t.task_name}</span> was created
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-slate-500">
                            {new Date(t.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No recent activity to show.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
