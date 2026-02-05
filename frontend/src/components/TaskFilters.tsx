interface TaskFiltersProps {
  filter: 'all' | 'active' | 'done';
  setFilter: (filter: 'all' | 'active' | 'done') => void;
  sortBy: 'date' | 'priority';
  setSortBy: (sort: 'date' | 'priority') => void;
}

export default function TaskFilters({ filter, setFilter, sortBy, setSortBy }: TaskFiltersProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-4 bg-black/40 backdrop-blur-md border border-indigo-500/20 rounded-xl p-4">
      <div className="flex gap-2 items-center">
        <span className="text-sm font-semibold text-slate-300">Filter:</span>
        {(['all', 'active', 'done'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              filter === f
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-indigo-500/20'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <span className="text-sm font-semibold text-slate-300">Sort by:</span>
        {(['date', 'priority'] as const).map(s => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              sortBy === s
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-indigo-500/20'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
