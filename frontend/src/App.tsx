import { TaskProvider } from './context/TaskContext';
import TaskBoard from './components/TaskBoard';
import './App.css';

function App() {
  return (
    <TaskProvider>
      <TaskBoard />
    </TaskProvider>
  );
}

export default App;
