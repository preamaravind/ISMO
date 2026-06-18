import { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../api/axios';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  // Form State
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Not Started');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const { data } = await axiosInstance.get('/projects');
      setProjects(data.data);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects locally for immediate UI update (could also be done via API)
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.project_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter ? p.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentProject(null);
    setProjectName('');
    setDescription('');
    setStatus('Not Started');
    setStartDate('');
    setEndDate('');
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setIsEditMode(true);
    setCurrentProject(project);
    setProjectName(project.project_name);
    setDescription(project.description || '');
    setStatus(project.status || 'Not Started');
    setStartDate(project.start_date || '');
    setEndDate(project.end_date || '');
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? All associated tasks will also be deleted.')) return;
    try {
      await axiosInstance.delete(`/projects/${id}`);
      showSuccess('Project deleted successfully');
      fetchProjects();
    } catch (err) {
      showError('Failed to delete project');
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    const payload = {
      project_name: projectName,
      description,
      status,
      start_date: startDate || null,
      end_date: endDate || null
    };

    try {
      if (isEditMode && currentProject) {
        await axiosInstance.put(`/projects/${currentProject.id}`, payload);
        showSuccess('Project updated successfully!');
      } else {
        await axiosInstance.post('/projects', payload);
        showSuccess('Project created successfully!');
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save project');
    }
  };

  const calculateProgress = (project) => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(t => t.status === 'Completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
        <div className="flex gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm flex-1 md:w-64"
          />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button 
            onClick={openCreateModal}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors whitespace-nowrap text-sm font-medium shadow-sm"
          >
            + New Project
          </button>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 mb-4 flex justify-center">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No projects found</h3>
          <p className="text-slate-500 mb-6">Get started by creating a new project or adjust your filters.</p>
          <button 
            onClick={openCreateModal}
            className="text-indigo-600 font-medium hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-md transition-colors"
          >
            Create your first project &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(p => {
            const progress = calculateProgress(p);
            return (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col h-full">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    p.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                    p.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {p.status || 'Not Started'}
                  </span>
                  <div className="flex space-x-2">
                    <button onClick={() => openEditModal(p)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button onClick={() => handleDeleteProject(p.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
                
                <Link to={`/projects/${p.id}`} className="block group">
                  <h3 className="font-bold text-lg mb-2 text-slate-900 group-hover:text-indigo-600 transition-colors">{p.project_name}</h3>
                </Link>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2 min-h-[40px]">{p.description || 'No description provided.'}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <div className="flex -space-x-2 overflow-hidden">
                    {/* Placeholder Avatars */}
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://ui-avatars.com/api/?name=User+One&background=random" alt=""/>
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://ui-avatars.com/api/?name=User+Two&background=random" alt=""/>
                    <div className="inline-flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-white bg-slate-200 text-[10px] font-medium text-slate-600">+3</div>
                  </div>
                  <div className="text-xs text-slate-500 font-medium flex flex-col items-end">
                    <span>{p.start_date ? new Date(p.start_date).toLocaleDateString() : 'No start date'}</span>
                    <span>to {p.end_date ? new Date(p.end_date).toLocaleDateString() : 'TBD'}</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 rounded-b-xl flex justify-center">
                <Link to={`/projects/${p.id}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 w-full text-center">
                  View Full Details &rarr;
                </Link>
              </div>
            </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Project" : "Create New Project"}>
        <form onSubmit={handleSaveProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              required 
              value={projectName} 
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" 
              placeholder="e.g. Website Redesign"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              rows={3}
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" 
              placeholder="What is this project about?"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-600" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-600" 
              />
            </div>
          </div>

          <div className="pt-5 flex justify-end space-x-3 border-t border-slate-100 mt-6">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              {isEditMode ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
