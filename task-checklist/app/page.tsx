import TaskChecklist from "./components/TaskChecklist";
import SnakeGame from "./components/SnakeGame";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors gap-8">
      <TaskChecklist />
      <SnakeGame />
    </main>
  );
}
