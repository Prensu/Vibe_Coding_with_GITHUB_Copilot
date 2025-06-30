import SnakeGame from "./components/SnakeGame";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
      <SnakeGame />
    </main>
  );
}
