import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const { showSuccess, showError } = useToast();

  const fetchTasks = async () => {
    try {
      const { data } = await axiosInstance.get('/tasks');
      setTasks(data.data);
    } catch(err) {
      console.error(err);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await axiosInstance.get('/projects');
      setProjects(data.data);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!projectId) {
      showError('Please select a project');
      return;
    }
    try {
      await axiosInstance.post('/tasks', {
        task_name: taskName,
        project_id: projectId,
        priority,
        status
      });
      showSuccess('Task created successfully!');
      setIsModalOpen(false);
      setTaskName('');
      setProjectId('');
      setPriority('Medium');
      setStatus('Pending');
      fetchTasks();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Tasks</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          + New Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="text-slate-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">No tasks found</h3>
          <p className="text-slate-500 mb-4">Get started by creating a new task.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-indigo-600 font-medium hover:text-indigo-800"
          >
            Create your first task &rarr;
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Task Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Priority</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {tasks.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{t.task_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{t.project?.project_name || 'Unknown Project'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      t.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                      t.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      t.priority === 'High' ? 'bg-red-100 text-red-800' : 
                      t.priority === 'Low' ? 'bg-slate-100 text-slate-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        {projects.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-slate-600 mb-4">You need to create a project before adding tasks.</p>
            <Link to="/projects" className="text-indigo-600 font-medium hover:text-indigo-800">
              Go to Projects page &rarr;
            </Link>
          </div>
        ) : (
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Task Name</label>
              <input 
                type="text" 
                required 
                value={taskName} 
                onChange={(e) => setTaskName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                placeholder="e.g. Design Login Page"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Project</label>
              <select 
                required
                value={projectId} 
                onChange={(e) => setProjectId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="" disabled>Select a project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.project_name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Priority</label>
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div className="pt-4 flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create Task
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default TasksPage;
