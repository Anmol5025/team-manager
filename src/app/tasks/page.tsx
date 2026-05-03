'use client';

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Plus, CheckSquare, Trash2, Loader2, X, User } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';

export default function Tasks() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({ 
    title: '', description: '', project: '', dueDate: '', status: 'Todo', assignedTo: '' 
  });

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        api.get('/tasks'),
        user?.role === 'Admin' ? api.get('/projects') : Promise.resolve({ data: [] }),
        user?.role === 'Admin' ? api.get('/users') : Promise.resolve({ data: [] })
      ]);
      setTasks(tasksRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
      if (usersRes.data) setAllUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/tasks', formData);
      setShowModal(false);
      setFormData({ title: '', description: '', project: '', dueDate: '', status: 'Todo', assignedTo: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.put(`/tasks/${id}`, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const filteredTasks = tasks.filter(task => filterStatus === 'All' || task.status === filterStatus);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="page-header-actions" style={{ marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h2 className="page-title">Tasks</h2>
              <p className="page-subtitle">Track and manage your team&apos;s to-dos.</p>
            </div>
            <div className="page-header-actions">
              <div className="filter-tabs">
                {['All', 'Todo', 'In Progress', 'Done'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              {user?.role === 'Admin' && (
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-primary"
                  style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.75rem' }}
                >
                  <Plus size={16} />
                  <span style={{ display: 'inline' }}>New Task</span>
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <Loader2 size={32} style={{ color: '#9ca3af' }} className="spinner" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <CheckSquare size={24} />
              </div>
              <h3>No tasks found</h3>
              <p>There are no tasks matching the current criteria.</p>
            </div>
          ) : (
            <div className="table-container">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Project</th>
                      <th>Assignee</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th><span style={{ visibility: 'hidden' }}>Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task) => {
                      const date = new Date(task.dueDate);
                      const isOverdue = task.status !== 'Done' && isPast(date) && !isToday(date);
                      
                      return (
                        <tr key={task._id}>
                          <td className="task-cell">
                            <div className="task-title">{task.title}</div>
                            <div className="task-description">{task.description}</div>
                          </td>
                          <td>
                            {task.project?.title || 'Unknown'}
                          </td>
                          <td>
                            <div className="assignee-cell">
                              <div className="assignee-avatar">
                                {task.assignedTo?.name?.charAt(0) || <User size={12} />}
                              </div>
                              <div className="assignee-name">
                                {task.assignedTo?.name || 'Unassigned'}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={isOverdue ? 'date-overdue' : ''}>
                              {format(date, 'MMM d, yyyy')}
                            </span>
                          </td>
                          <td>
                            <select 
                              value={task.status}
                              onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                              className={`status-select ${
                                task.status === 'Done' ? 'status-done' : 
                                task.status === 'In Progress' ? 'status-progress' : 'status-todo'
                              }`}
                            >
                              <option value="Todo">Todo</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Done">Done</option>
                            </select>
                          </td>
                          <td className="row-actions">
                            {user?.role === 'Admin' && (
                              <button 
                                onClick={() => handleDelete(task._id)} 
                                className="icon-btn"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Create Task Modal */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal" style={{ maxWidth: '32rem' }}>
                <div className="modal-header">
                  <h3 className="modal-title">Create New Task</h3>
                  <button onClick={() => setShowModal(false)} className="modal-close">
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="modal-body">
                  <div className="form" style={{ gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Task Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea
                        required
                        rows={2}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="form-input"
                        style={{ resize: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Project</label>
                        <select
                          required
                          value={formData.project}
                          onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                          className="form-select"
                        >
                          <option value="">Select Project</option>
                          {projects.map(p => (
                            <option key={p._id} value={p._id}>{p.title}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Assign To</label>
                        <select
                          value={formData.assignedTo}
                          onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                          className="form-select"
                        >
                          <option value="">Unassigned</option>
                          {allUsers.map(u => (
                            <option key={u._id} value={u._id}>{u.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Due Date</label>
                        <input
                          type="date"
                          required
                          value={formData.dueDate}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting || !formData.project}
                        className="btn-primary"
                        style={{ width: 'auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {submitting && <Loader2 size={16} className="spinner" style={{ marginRight: '0.5rem' }} />}
                        Create Task
                      </button>
                    </div>
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
