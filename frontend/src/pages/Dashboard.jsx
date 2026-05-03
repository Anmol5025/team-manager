import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { CheckCircle2, Clock, AlertCircle, ListTodo, Loader2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className={`p-2 rounded-md ${colorClass}`}>
        <Icon size={20} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
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

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 size={32} className="text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
          Good to see you, {user?.name?.split(' ')[0]}
        </h2>
        <p className="text-sm text-gray-500">Here's what's happening with your tasks today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
  );
};

export default Dashboard;
