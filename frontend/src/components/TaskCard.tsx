import { useState } from 'react';
import { Trash2, Lightbulb } from 'lucide-react';
import { useTaskContext, Task } from '../context/TaskContext';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { updateTask, deleteTask } = useTaskContext();
  const [showAI, setShowAI] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    todo: 'text-gray-500',
    'in-progress': 'text-blue-500',
    done: 'text-green-500'
  };

  const handleStatusChange = async () => {
    const statuses = ['todo', 'in-progress', 'done'];
    const currentIndex = statuses.indexOf(task.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    await updateTask(task.id, { status: nextStatus as any });
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id);
    }
  };

  const handleAISuggestion = async () => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/ai/suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          status: task.status
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestion(data.suggestion);
      }
    } catch (error) {
      console.error('Failed to get AI suggestion:', error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 flex-1">{task.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex gap-2 mb-3 flex-wrap">
        <span className={`text-xs font-semibold px-2 py-1 rounded ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
          {task.category}
        </span>
      </div>

      {task.dueDate && (
        <p className="text-xs text-gray-500 mb-3">
          Due: {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleStatusChange}
          className={`flex-1 text-xs font-semibold py-1 px-2 rounded border transition ${statusColors[task.status]}`}
        >
          {task.status === 'todo' && '⭕ To Do'}
          {task.status === 'in-progress' && '🔵 In Progress'}
          {task.status === 'done' && '✅ Done'}
        </button>
        <button
          onClick={() => {
            setShowAI(!showAI);
            if (!showAI && !suggestion) handleAISuggestion();
          }}
          className="text-indigo-600 hover:text-indigo-700 p-1 hover:bg-indigo-50 rounded"
        >
          <Lightbulb size={16} />
        </button>
      </div>

      {showAI && (
        <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded text-sm">
          {aiLoading ? (
            <p className="text-indigo-700">Getting AI suggestion...</p>
          ) : suggestion ? (
            <div>
              <p className="text-indigo-900 font-semibold mb-1">AI Suggestion:</p>
              <p className="text-indigo-700">{suggestion}</p>
            </div>
          ) : (
            <p className="text-indigo-700">No suggestion available</p>
          )}
        </div>
      )}
    </div>
  );
}
