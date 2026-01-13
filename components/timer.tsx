'use client'

type TimerProps = {
    timeRemaining: number;
}

function formatTime(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}


export default function Timer( { timeRemaining }: TimerProps) {  

   
    return (
        <div className="flex justify-center items-center py-16">
            <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-[var(--font-orbitron)] tracking-wider font-bold tabular-nums select-none">
                {formatTime(timeRemaining)}
            </h1>
        </div>
    )
}