import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import TaskFilters from './TaskFilters';

export default function TaskBoard() {
  const { tasks, loading, getTasks } = useTaskContext();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');

  // Load tasks with userId when component mounts
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      getTasks(userId);
    }
  }, [getTasks]);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return task.status !== 'done';
    if (filter === 'done') return task.status === 'done';
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const todoTasks = sortedTasks.filter(t => t.status === 'todo');
  const inProgressTasks = sortedTasks.filter(t => t.status === 'in-progress');
  const doneTasks = sortedTasks.filter(t => t.status === 'done');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white">My Tasks</h1>
              <p className="text-slate-400 mt-2">Organize and manage your work efficiently</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition shadow-lg hover:shadow-indigo-500/50"
            >
              <Plus size={20} /> New Task
            </button>
          </div>
        </header>

        {showForm && <TaskForm onClose={() => setShowForm(false)} />}

        <TaskFilters filter={filter} setFilter={setFilter} sortBy={sortBy} setSortBy={setSortBy} />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Todo Column */}
            <div className="bg-black/40 backdrop-blur-md border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/50 transition">
              <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-yellow-400/30 flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                To Do ({todoTasks.length})
              </h2>
              <div className="space-y-4">
                {todoTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {todoTasks.length === 0 && (
                  <p className="text-slate-500 text-center py-8">No tasks yet. Create one to get started!</p>
                )}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="bg-black/40 backdrop-blur-md border border-indigo-500/20 rounded-xl p-6 hover:border-indigo-500/50 transition">
              <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-indigo-400/30 flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
                In Progress ({inProgressTasks.length})
              </h2>
              <div className="space-y-4">
                {inProgressTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {inProgressTasks.length === 0 && (
                  <p className="text-slate-500 text-center py-8">Start a task to see it here</p>
                )}
              </div>
            </div>

            {/* Done Column */}
            <div className="bg-black/40 backdrop-blur-md border border-green-500/20 rounded-xl p-6 hover:border-green-500/50 transition">
              <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-green-400/30 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                Done ({doneTasks.length})
              </h2>
              <div className="space-y-4">
                {doneTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {doneTasks.length === 0 && (
                  <p className="text-slate-500 text-center py-8">Complete tasks to celebrate!</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
