interface TaskFiltersProps {
  filter: 'all' | 'active' | 'done';
  setFilter: (filter: 'all' | 'active' | 'done') => void;
  sortBy: 'date' | 'priority';
  setSortBy: (sort: 'date' | 'priority') => void;
}

export default function TaskFilters({ filter, setFilter, sortBy, setSortBy }: TaskFiltersProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-4 bg-white rounded-lg shadow-md p-4">
      <div className="flex gap-2">
        <span className="text-sm font-semibold text-gray-700 self-center">Filter:</span>
        {(['all', 'active', 'done'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              filter === f
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <span className="text-sm font-semibold text-gray-700 self-center">Sort by:</span>
        {(['date', 'priority'] as const).map(s => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              sortBy === s
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
