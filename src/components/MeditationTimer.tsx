
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw } from "lucide-react";

interface MeditationTimerProps {
  initialMinutes?: number;
  onComplete?: () => void;
  onClose?: () => void;
}

const MeditationTimer: React.FC<MeditationTimerProps> = ({
  initialMinutes = 5,
  onComplete,
  onClose,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [minutes, setMinutes] = useState(initialMinutes);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Set up meditation timer
  useEffect(() => {
    setTotalSeconds(minutes * 60);
    setRemainingSeconds(minutes * 60);
  }, [minutes]);

  // Timer countdown logic
  useEffect(() => {
    if (isActive && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsActive(false);
            onComplete?.();
            toast({
              title: "Meditation Complete",
              description: "Your meditation session has finished. How do you feel?",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isActive && intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, remainingSeconds, onComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setRemainingSeconds(totalSeconds);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  return (
    <div className="meditation-card w-full max-w-md mx-auto animate-fade-in">
      <h3 className="text-xl font-semibold text-center mb-6">Meditation Timer</h3>
      
      <div className="text-center mb-8">
        <div className="text-4xl font-light mb-2">{formatTime(remainingSeconds)}</div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm">Duration: {minutes} minutes</span>
          <span className="text-sm">{minutes === 1 ? "Short" : minutes >= 15 ? "Long" : "Medium"}</span>
        </div>
        <Slider
          value={[minutes]}
          min={1}
          max={30}
          step={1}
          disabled={isActive}
          onValueChange={(value) => setMinutes(value[0])}
          className="mb-2"
        />
      </div>
      
      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={resetTimer}
          disabled={remainingSeconds === totalSeconds && !isActive}
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
        
        <Button
          className="h-14 w-14 rounded-full bg-spiritual-deep hover:bg-spiritual-deep/90"
          onClick={toggleTimer}
        >
          {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <span aria-hidden="true">×</span>
        </Button>
      </div>
      
      <div className="text-center mt-6 text-sm text-muted-foreground">
        Find a comfortable position, close your eyes, and focus on your breath.
      </div>
    </div>
  );
};

export default MeditationTimer;
