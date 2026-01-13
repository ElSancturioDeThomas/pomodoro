'use client'

type ButtonProps = {
    variant: 'start' | 'stop' | 'reset';
    setTimeCounting?: (timeCounting: boolean) => void;
    onReset?: () => void;
}

// Arrow icon SVG for reset button - defined outside component
const ArrowIcon = () => (
    <svg 
        className="w-8 h-8" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
        />
    </svg>
)

export default function Button({ variant, setTimeCounting, onReset }: ButtonProps) {
    
    const handleClick = () => {
        if (variant === 'start') {
            setTimeCounting?.(true);
        } else if (variant === 'stop') {
            setTimeCounting?.(false);
        } else if (variant === 'reset') {
            onReset?.();
        }
    }
    
    // Get button styles based on variant
    const getButtonStyles = () => {
        const baseStyles = "flex justify-center items-center rounded-full transition-colors w-20 h-20";
        
        switch (variant) {
            case 'start':
                return `${baseStyles} bg-green-500 hover:bg-green-600`;
            case 'stop':
                return `${baseStyles} bg-red-500 hover:bg-red-600`;
            case 'reset':
                return `${baseStyles} bg-blue-500 hover:bg-blue-600`;
            default:
                return baseStyles;
        }
    }
    
    return (
        <button 
            className={getButtonStyles()}
            onClick={handleClick}
        >
            {variant === 'start' ? (
                <span className="text-base font-semibold">Start</span>
            ) : variant === 'stop' ? (
                <span className="text-base font-semibold">Stop</span>
            ) : (
                <ArrowIcon />
            )}
        </button>
    )
}