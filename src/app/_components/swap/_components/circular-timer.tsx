import { cn } from "~/lib/utils/cn";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~components/ui/tooltip";

type CircularTimerProps = {
  timeLeft: number;
  totalTime?: number;
};

export default function CircularTimer({
  timeLeft,
  totalTime = 30000,
}: CircularTimerProps) {
  const progress = (timeLeft / totalTime) * 100;
  const secondsLeft = Math.ceil(timeLeft / 1000);

  // Calculate color based on time left
  const getColor = () => {
    if (progress > 66) return "stroke-green-500";
    if (progress > 33) return "stroke-yellow-500";
    return "stroke-red-500";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="relative h-6 w-6">
            <svg className="h-full w-full" viewBox="0 0 32 32">
              <circle
                className="stroke-card"
                strokeWidth="4"
                fill="transparent"
                r="14"
                cx="16"
                cy="16"
              />
              <circle
                className={cn("transition-all duration-500", getColor())}
                strokeWidth="4"
                strokeDasharray={88}
                strokeDashoffset={88 - (progress / 100) * 88}
                strokeLinecap="round"
                fill="transparent"
                r="14"
                cx="16"
                cy="16"
                transform="rotate(-90 16 16)"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium">
              {secondsLeft}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{secondsLeft} seconds until next refresh</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
