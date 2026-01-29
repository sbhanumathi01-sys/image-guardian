import { Loader2 } from "lucide-react";

interface ProcessingStateProps {
  stage: "uploading" | "ela" | "predicting";
  imagePreview: string;
}

const stages = {
  uploading: { label: "Uploading Image", progress: 33 },
  ela: { label: "Generating ELA", progress: 66 },
  predicting: { label: "CNN Analysis", progress: 90 },
};

const ProcessingState = ({ stage, imagePreview }: ProcessingStateProps) => {
  const currentStage = stages[stage];

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Image Preview with Overlay */}
      <div className="relative rounded-2xl overflow-hidden border border-border">
        <img
          src={imagePreview}
          alt="Processing image"
          className="w-full h-auto max-h-[350px] object-contain opacity-50"
        />
        
        {/* Scanning Animation Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/0 via-accent/20 to-accent/0 animate-scan" />
        
        {/* Center Loading Indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-background/90 backdrop-blur-xl border border-border shadow-lg">
            <div className="relative">
              <Loader2 className="h-12 w-12 text-accent animate-spin" />
              <div className="absolute inset-0 h-12 w-12 rounded-full animate-pulse-glow" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg">{currentStage.label}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please wait while we analyze your image
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{currentStage.label}...</span>
          <span className="text-muted-foreground">{currentStage.progress}%</span>
        </div>
        
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-accent transition-all duration-500 rounded-full"
            style={{ width: `${currentStage.progress}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 bg-accent/50 rounded-full animate-pulse"
            style={{ width: `${currentStage.progress + 5}%` }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between">
          {Object.entries(stages).map(([key, value], index) => {
            const isActive = key === stage;
            const isCompleted = value.progress < currentStage.progress;
            
            return (
              <div
                key={key}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`
                    flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all
                    ${isActive ? "bg-accent text-accent-foreground scale-110" : ""}
                    ${isCompleted ? "bg-success text-success-foreground" : ""}
                    ${!isActive && !isCompleted ? "bg-muted text-muted-foreground" : ""}
                  `}
                >
                  {index + 1}
                </div>
                <span className={`text-xs ${isActive ? "text-accent font-medium" : "text-muted-foreground"}`}>
                  {value.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProcessingState;
