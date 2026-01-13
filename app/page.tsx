'use client'

import Timer from "@/components/timer";
import Button from "@/components/button";
import Tasks from "@/components/tasks";
import { useState, useEffect } from "react";

export default function Home() {

const [timeCounting, setTimeCounting] = useState(false);
const [timeRemaining, setTimeRemaining] = useState(25 * 60)
const [sessionType, setSessionType] = useState<'workhard' | 'shortBreak' | 'longBreak'>('workhard');
const [pomodoroCount, setPomodoroCount] = useState(0);

const handleReset = () => {
  setTimeCounting(false);
  setSessionType('workhard');
  setTimeRemaining(25 * 60);
  setPomodoroCount(0);
}

useEffect(() => {
  if (timeCounting) {
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }
}, [timeCounting, timeRemaining]);

useEffect(() => {
  if (timeRemaining === 0 && timeCounting) {
    if (sessionType === 'workhard') {
      if (pomodoroCount < 2) {
        // Go to short break
        setSessionType('shortBreak');
        setTimeRemaining(5 * 60);
        setPomodoroCount(prev => prev + 1);
      } else {
        // Go to long break
        setSessionType('longBreak');
        setTimeRemaining(30 * 60);
        setPomodoroCount(0);
      }
    } else {
      // Break finished, back to workhard
      setSessionType('workhard');
      setTimeRemaining(25 * 60);
    }
  }
}, [timeRemaining, timeCounting]);

  return (
    <div className=" mt-10 min-h-screen bg-zinc-50 font-sans dark:bg-black py-8">
      <main className="w-full max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-left text-4xl font-bold mb-4">Pomodoro</h1>
          <h1 className="text-right text-4xl font-bold mb-4">{sessionType.toUpperCase()}</h1>
        </div>
        {/* Timer and Buttons Side-by-Side */}
        <div className="flex items-center justify-center gap-8 mt-10">
          {/* Timer Section - Left Side */}
          <div className="flex-1">
            <Timer timeRemaining={timeRemaining} />
          </div>
          
          {/* Buttons Section - Right Side (Sidebar) */}
          <div className="flex flex-col items-center gap-4">
            {timeCounting ? (
              <Button variant="stop" setTimeCounting={setTimeCounting}/>
            ) : (
              <Button variant="start" setTimeCounting={setTimeCounting}/>
            )}
            <Button variant="reset" onReset={handleReset}/>
          </div>
        </div>
        
        {/* Tasks Section - Below Timer */}
        <div className="mt-10">
          <Tasks />
        </div>
      </main>
    </div>
  );
}
