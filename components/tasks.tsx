'use client'

import { useState } from "react";

type Task = {
    id: number;
    title: string;
    completed: boolean;
}

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [inputValue, setInputValue] = useState('');

    const handleAddTask = () => {
        if (inputValue.trim()) {
            setTasks([...tasks, { 
                id: Date.now(),
                title: inputValue.trim(), 
                completed: false 
            }]);
            setInputValue('');
        }
    }
    const handleDeleteTask = (id: number) => {
        setTasks(tasks.filter((task) => task.id !== id));
    }

    const handleToggleComplete = (id: number) => {
        setTasks(tasks.map((task) => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    }

    return (
        <div className="w-full mt-10">
            <h1 className="text-4xl font-bold mb-4">Tasks</h1>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && inputValue.trim()) {
                        handleAddTask();
                    }
                }}
                placeholder="Add a task..."
                className="w-full p-4 text-lg rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <ul className="space-y-2">
                {tasks.length === 0 ? (
                    <li className="text-gray-500 dark:text-gray-400 text-sm italic"></li>
                ) : (
                    tasks.map((task) => (
                        <li key={task.id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleToggleComplete(task.id)}
                                className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span 
                                className={`flex-1 text-lg ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}
                            >
                                {task.title}
                            </span>
                            {task.completed && (
                                <button 
                                    onClick={() => handleDeleteTask(task.id)} 
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded transition-colors text-base font-semibold"
                                >
                                    Delete
                                </button>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    )
}   