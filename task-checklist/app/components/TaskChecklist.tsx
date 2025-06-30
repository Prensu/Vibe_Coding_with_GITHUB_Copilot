"use client";
import React, { useState, useEffect } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const LOCAL_STORAGE_KEY = "taskChecklistTasks";

const TaskChecklist: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: input.trim(), completed: false },
    ]);
    setInput("");
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800 dark:text-gray-100 tracking-tight">Task Checklist</h1>
        <div className="flex mb-6 gap-2">
          <input
            className="flex-1 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 placeholder-gray-400 dark:placeholder-gray-400 transition-colors"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
          />
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-r-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-colors"
            onClick={addTask}
          >
            Add
          </button>
        </div>
        <ul className="space-y-3">
          {tasks.map(task => (
            <li
              key={task.id}
              className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 transition-colors"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="mr-3 accent-blue-500 w-5 h-5"
                />
                <span
                  className={
                    task.completed
                      ? "line-through text-gray-400 dark:text-gray-500 select-none text-lg"
                      : "text-gray-800 dark:text-gray-100 select-none text-lg"
                  }
                >
                  {task.text}
                </span>
              </div>
              <button
                className="ml-3 text-red-500 hover:text-red-700 dark:hover:text-red-400 text-xl font-bold transition-colors"
                onClick={() => deleteTask(task.id)}
                aria-label="Delete task"
              >
                &#10005;
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskChecklist;
