'use client';

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Plus, FolderKanban, Users, Trash2, Loader2, X } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';

export default function Projects() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', members: [] });
  const [submitting, setSubmitting] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  const fetchProjects = async () => {
    try {
      const [projectsRes, usersRes] = await Promise.all([
        api.get('/projects'),
        user?.role === 'Admin' ? api.get('/users') : Promise.resolve({ data: [] })
      ]);
      setProjects(projectsRes.data);
      if (usersRes.data) setAllUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/projects', formData);
      setShowModal(false);
      setFormData({ title: '', description: '', members: [] });
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="container">
          <div className="page-header-flex">
            <div>
              <h2 className="page-title">Projects</h2>
              <p className="page-subtitle">Manage and view your team projects.</p>
            </div>
            {user?.role === 'Admin' && (
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-primary"
                style={{width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
              >
                <Plus size={16} />
                <span>New Project</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="loading-container" style={{height: '16rem'}}>
              <Loader2 size={32} className="spinner" style={{color: '#9ca3af'}} />
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FolderKanban size={24} />
              </div>
              <h3>No projects found</h3>
              <p>
                {user?.role === 'Admin' 
                  ? "You haven't created any projects yet. Click 'New Project' to get started." 
                  : "You haven't been assigned to any projects yet."}
              </p>
            </div>
          ) : (
            <div className="project-grid">
              {projects.map((project) => (
                <div key={project._id} className="project-card">
                  <div className="project-card-header">
                    <h3 className="project-card-title">{project.title}</h3>
                    {user?.role === 'Admin' && (
                      <div className="project-card-actions">
                        <button onClick={() => handleDelete(project._id)} className="icon-btn">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <p className="project-card-description">{project.description}</p>
                  
                  <div className="project-card-footer">
                    <div className="project-card-meta">
                      <Users size={14} />
                      <span>{project.members?.length || 0} members</span>
                    </div>
                    <div className="project-card-meta">
                      By {project.createdBy?.name?.split(' ')[0]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3 className="modal-title">Create New Project</h3>
                  <button onClick={() => setShowModal(false)} className="modal-close">
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="form" style={{gap: '1rem'}}>
                      <div className="form-group">
                        <label className="form-label">Project Title</label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="form-input"
                          placeholder="e.g. Website Redesign"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                          required
                          rows={3}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="form-input"
                          placeholder="Briefly describe the project goals..."
                          style={{resize: 'none'}}
                        />
                      </div>

                      {user?.role === 'Admin' && allUsers.length > 0 && (
                        <div className="form-group">
                          <label className="form-label">Project Members (Hold Ctrl/Cmd to select multiple)</label>
                          <select
                            multiple
                            value={formData.members}
                            onChange={(e) => {
                              const options = [...e.target.selectedOptions];
                              const values = options.map(option => option.value);
                              setFormData({ ...formData, members: values as any });
                            }}
                            className="form-select custom-scrollbar"
                            style={{height: '8rem'}}
                          >
                            {allUsers.map(u => (
                              <option key={u._id} value={u._id} style={{padding: '0.25rem'}}>{u.name} ({u.email})</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary"
                    >
                      {submitting && <Loader2 size={16} className="spinner" style={{marginRight: '0.5rem'}} />}
                      Create Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
