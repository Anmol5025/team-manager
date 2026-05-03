'use client';

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { CheckCircle2, Clock, AlertCircle, ListTodo, Loader2 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';

const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
  <div className="stat-card">
    <div className="stat-card-content">
      <div className="stat-card-text">
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
      <div className={`stat-card-icon ${colorClass}`}>
        <Icon size={20} />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/tasks/dashboard');
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="loading-container">
            <Loader2 size={32} className="spinner" style={{color: '#9ca3af'}} />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="container">
          <div className="page-header" style={{marginBottom: '2rem'}}>
            <h2 className="page-title">
              Good to see you, {user?.name?.split(' ')[0]}
            </h2>
            <p className="page-subtitle">Here&apos;s what&apos;s happening with your tasks today.</p>
          </div>

          <div className="grid grid-cols-1 sm-grid-cols-2 lg-grid-cols-4">
            <StatCard 
              title="Total Tasks" 
              value={stats.totalTasks} 
              icon={ListTodo} 
              colorClass="bg-blue-50 text-blue-600" 
            />
            <StatCard 
              title="Completed" 
              value={stats.completedTasks} 
              icon={CheckCircle2} 
              colorClass="bg-green-50 text-green-600" 
            />
            <StatCard 
              title="Pending" 
              value={stats.pendingTasks} 
              icon={Clock} 
              colorClass="bg-yellow-50 text-yellow-600" 
            />
            <StatCard 
              title="Overdue" 
              value={stats.overdueTasks} 
              icon={AlertCircle} 
              colorClass="bg-red-50 text-red-600" 
            />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
