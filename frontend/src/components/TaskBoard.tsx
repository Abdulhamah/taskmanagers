import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import TaskFilters from './TaskFilters';

export default function TaskBoard() {
  const { tasks, loading } = useTaskContext();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">TaskMaster AI</h1>
              <p className="text-gray-600 mt-2">Smart task management with AI assistance</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg flex items-center gap-2 transition"
            >
              <Plus size={20} /> New Task
            </button>
          </div>
        </header>

        {showForm && <TaskForm onClose={() => setShowForm(false)} />}

        <TaskFilters filter={filter} setFilter={setFilter} sortBy={sortBy} setSortBy={setSortBy} />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Todo Column */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-yellow-400">
                To Do ({todoTasks.length})
              </h2>
              <div className="space-y-4">
                {todoTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-blue-400">
                In Progress ({inProgressTasks.length})
              </h2>
              <div className="space-y-4">
                {inProgressTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>

            {/* Done Column */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-green-400">
                Done ({doneTasks.length})
              </h2>
              <div className="space-y-4">
                {doneTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
