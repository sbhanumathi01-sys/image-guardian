import type { ConfusionMatrix } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface ConfusionMatrixDisplayProps {
  data: ConfusionMatrix;
}

const ConfusionMatrixDisplay = ({ data }: ConfusionMatrixDisplayProps) => {
  const { truePositive, falsePositive, trueNegative, falseNegative } = data;
  const total = truePositive + falsePositive + trueNegative + falseNegative;

  const cells = [
    { value: trueNegative, label: "TN", color: "bg-success/20 text-success", row: "Authentic", col: "Authentic" },
    { value: falsePositive, label: "FP", color: "bg-warning/20 text-warning", row: "Authentic", col: "Forged" },
    { value: falseNegative, label: "FN", color: "bg-destructive/20 text-destructive", row: "Forged", col: "Authentic" },
    { value: truePositive, label: "TP", color: "bg-success/20 text-success", row: "Forged", col: "Forged" },
  ];

  return (
    <div className="metric-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Confusion Matrix</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Classification results breakdown (n = {total.toLocaleString()})
        </p>
      </div>

      <div className="space-y-4">
        {/* Matrix Labels */}
        <div className="flex justify-center">
          <span className="text-sm font-medium text-muted-foreground">
            Predicted Label
          </span>
        </div>

        {/* Matrix Grid */}
        <div className="flex items-center gap-4 justify-center">
          {/* Y-axis label */}
          <div className="flex items-center justify-center h-full">
            <span className="text-sm font-medium text-muted-foreground -rotate-90 whitespace-nowrap">
              True Label
            </span>
          </div>

          <div className="space-y-1">
            {/* Column Headers */}
            <div className="grid grid-cols-3 gap-1">
              <div />
              <div className="text-center text-xs font-medium text-muted-foreground py-2">
                Authentic
              </div>
              <div className="text-center text-xs font-medium text-muted-foreground py-2">
                Forged
              </div>
            </div>

            {/* Authentic Row */}
            <div className="grid grid-cols-3 gap-1">
              <div className="flex items-center justify-end pr-2 text-xs font-medium text-muted-foreground">
                Authentic
              </div>
              <div
                className={cn(
                  "aspect-square min-w-[80px] rounded-lg flex flex-col items-center justify-center",
                  cells[0].color
                )}
              >
                <span className="text-2xl font-bold font-mono">{trueNegative}</span>
                <span className="text-xs opacity-70">TN</span>
              </div>
              <div
                className={cn(
                  "aspect-square min-w-[80px] rounded-lg flex flex-col items-center justify-center",
                  cells[1].color
                )}
              >
                <span className="text-2xl font-bold font-mono">{falsePositive}</span>
                <span className="text-xs opacity-70">FP</span>
              </div>
            </div>

            {/* Forged Row */}
            <div className="grid grid-cols-3 gap-1">
              <div className="flex items-center justify-end pr-2 text-xs font-medium text-muted-foreground">
                Forged
              </div>
              <div
                className={cn(
                  "aspect-square min-w-[80px] rounded-lg flex flex-col items-center justify-center",
                  cells[2].color
                )}
              >
                <span className="text-2xl font-bold font-mono">{falseNegative}</span>
                <span className="text-xs opacity-70">FN</span>
              </div>
              <div
                className={cn(
                  "aspect-square min-w-[80px] rounded-lg flex flex-col items-center justify-center",
                  cells[3].color
                )}
              >
                <span className="text-2xl font-bold font-mono">{truePositive}</span>
                <span className="text-xs opacity-70">TP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-success/20" />
            <span>Correct</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-warning/20" />
            <span>False Positive</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-destructive/20" />
            <span>False Negative</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfusionMatrixDisplay;
