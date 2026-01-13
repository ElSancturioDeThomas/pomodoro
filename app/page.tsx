'use client'

import Timer from "@/components/timer";
import Button from "@/components/button";
import Tasks from "@/components/tasks";
import { useState, useEffect, useRef } from "react";

export default function Home() {

const [timeCounting, setTimeCounting] = useState(false);
const [timeRemaining, setTimeRemaining] = useState(25 * 60)
const [sessionType, setSessionType] = useState<'workhard' | 'shortBreak' | 'longBreak'>('workhard');
const [pomodoroCount, setPomodoroCount] = useState(0);
const sessionTypeRef = useRef(sessionType);
const pomodoroCountRef = useRef(pomodoroCount);
const audioContextRef = useRef<AudioContext | null>(null);
const workhardAudioRef = useRef<HTMLAudioElement | null>(null);
const breakAudioRef = useRef<HTMLAudioElement | null>(null);

// Keep refs in sync with state
useEffect(() => {
  sessionTypeRef.current = sessionType;
}, [sessionType]);

useEffect(() => {
  pomodoroCountRef.current = pomodoroCount;
}, [pomodoroCount]);

const handleReset = () => {
  setTimeCounting(false);
  setSessionType('workhard');
  setTimeRemaining(25 * 60);
  setPomodoroCount(0);
}


// Function to unlock audio context and preload sounds (required for browser autoplay policies)
const unlockAudio = async () => {
  try {
    if (!audioContextRef.current) {
      // Handle browser compatibility for AudioContext
      const AudioContextClass = window.AudioContext || 
        (window as typeof window & { webkitAudioContext: new () => AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }
    // Resume audio context if suspended (browser autoplay policy)
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    
    // Preload audio files on first unlock
    if (!workhardAudioRef.current) {
      workhardAudioRef.current = new Audio('/workhardCompleted.mp3');
      workhardAudioRef.current.volume = 0.7;
      workhardAudioRef.current.preload = 'auto';
    }
    if (!breakAudioRef.current) {
      breakAudioRef.current = new Audio('/breakCompleted.mp3');
      breakAudioRef.current.volume = 0.7;
      breakAudioRef.current.preload = 'auto';
    }
    
    // Play a silent sound to "prime" the audio context
    // This ensures audio can play later without user interaction
    const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=');
    silentAudio.volume = 0;
    await silentAudio.play().catch(() => {}); // Ignore errors for silent audio
  } catch (err) {
    console.log('Audio unlock attempt:', err);
  }
}

// Function to play notification sound based on session type
const playNotificationSound = (sessionType: 'workhard' | 'shortBreak' | 'longBreak') => {
  try {
    // Determine which audio to play
    const audio = sessionType === 'workhard' 
      ? workhardAudioRef.current 
      : breakAudioRef.current;
    
    if (audio) {
      // Reset audio to beginning and play
      audio.currentTime = 0;
      audio.play().catch((err: unknown) => {
        console.log('Audio play failed:', err);
        if (err instanceof Error && err.name === 'NotAllowedError') {
          console.log('Audio blocked. Make sure you clicked Start/Stop button first to enable audio.');
        }
      });
    } else {
      console.log('Audio not loaded yet');
    }
  } catch (err: unknown) {
    console.log('Error playing sound:', err);
  }
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
    // Use refs to access current values without adding to dependencies
    const currentSession = sessionTypeRef.current;
    const currentCount = pomodoroCountRef.current;
    
    // Stop the timer first
    setTimeCounting(false);
    
    // Play notification sound when timer completes (based on current session)
    playNotificationSound(currentSession);
    
    // Small delay before transitioning to next session to ensure sound plays
    setTimeout(() => {
      if (currentSession === 'workhard') {
        if (currentCount < 2) {
          // Go to short break and auto-start
          setSessionType('shortBreak');
          setTimeRemaining(5 * 60);
          setPomodoroCount(prev => prev + 1);
          setTimeCounting(true); // Auto-start short break
        } else {
          // Go to long break and auto-start
          setSessionType('longBreak');
          setTimeRemaining(30 * 60);
          setPomodoroCount(0);
          setTimeCounting(true); // Auto-start long break
        }
      } else if (currentSession === 'shortBreak') {
        // Short break finished, back to workhard and auto-start
        setSessionType('workhard');
        setTimeRemaining(25 * 60);
        setTimeCounting(true); // Auto-start workhard
      } else {
        // Long break finished, reset (don't auto-start)
        setSessionType('workhard');
        setTimeRemaining(25 * 60);
        setPomodoroCount(0);
        // Don't auto-start - user needs to click Start
      }
    }, 100); // Small delay to ensure sound starts playing
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
              <Button variant="stop" setTimeCounting={(value) => {
                unlockAudio(); // Unlock audio on user interaction
                setTimeCounting(value);
              }}/>
            ) : (
              <Button variant="start" setTimeCounting={(value) => {
                unlockAudio(); // Unlock audio on user interaction
                setTimeCounting(value);
              }}/>
            )}
            <Button variant="reset" onReset={() => {
              unlockAudio(); // Unlock audio on user interaction
              handleReset();
            }}/>
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
