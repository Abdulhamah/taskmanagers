import { useState } from 'react';
import { Trash2, Lightbulb, Bell } from 'lucide-react';
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
    low: 'bg-blue-500/30 text-blue-200 border border-blue-500/50',
    medium: 'bg-yellow-500/30 text-yellow-200 border border-yellow-500/50',
    high: 'bg-red-500/30 text-red-200 border border-red-500/50'
  };

  const statusColors = {
    todo: 'text-yellow-400',
    'in-progress': 'text-indigo-400',
    done: 'text-green-400'
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
    <div className="bg-slate-800/50 border border-indigo-500/20 rounded-lg p-4 hover:border-indigo-500/50 hover:bg-slate-800/70 transition backdrop-blur-sm">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-white flex-1 text-sm">{task.title}</h3>
        <button
          onClick={handleDelete}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-1 rounded transition"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex gap-2 mb-3 flex-wrap">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <span className="text-xs bg-purple-500/30 text-purple-200 px-2 py-1 rounded-full border border-purple-500/20">
          {task.category}
        </span>
      </div>

      {task.dueDate && (
        <p className="text-xs text-slate-400 mb-2">
          Due: {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
        </p>
      )}

      {task.reminderDate && (
        <p className="text-xs text-indigo-300 mb-3 flex items-center gap-1">
          <Bell size={14} /> Reminder: {formatDistanceToNow(new Date(task.reminderDate), { addSuffix: true })}
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleStatusChange}
          className={`flex-1 text-xs font-semibold py-2 px-2 rounded border transition ${statusColors[task.status]} border-current/30 hover:bg-current/10`}
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
          className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 p-2 rounded transition"
          title="Get AI Suggestion"
        >
          <Lightbulb size={16} />
        </button>
      </div>

      {showAI && (
        <div className="mt-3 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded text-xs">
          {aiLoading ? (
            <p className="text-indigo-300">✨ Getting AI suggestion...</p>
          ) : suggestion ? (
            <div>
              <p className="text-indigo-200 font-semibold mb-1">💡 AI Tip:</p>
              <p className="text-indigo-300">{suggestion}</p>
            </div>
          ) : (
            <p className="text-indigo-400">No suggestion available</p>
          )}
        </div>
      )}
    </div>
  );
}
