import { CheckCircle, AlertTriangle, Clock, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PredictionResult } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface ResultDisplayProps {
  result: PredictionResult;
  onReset: () => void;
}

const ResultDisplay = ({ result, onReset }: ResultDisplayProps) => {
  const { isForged, confidence, elaImageUrl, heatmapUrl, originalImageUrl, processingTime } = result;

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Result Banner */}
      <div
        className={cn(
          "p-6 rounded-2xl border-2 transition-all",
          isForged
            ? "status-forged bg-destructive/5"
            : "status-authentic bg-success/5"
        )}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-2xl",
                isForged ? "bg-destructive/20" : "bg-success/20"
              )}
            >
              {isForged ? (
                <AlertTriangle className="h-7 w-7 text-destructive" />
              ) : (
                <CheckCircle className="h-7 w-7 text-success" />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold">
                {isForged ? "Forged Image Detected" : "Authentic Image"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                CNN model analysis completed successfully
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-sm text-muted-foreground">Confidence</p>
            <p className="text-3xl font-bold font-mono">
              {(confidence * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-current/10 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Processing time: {processingTime}s</span>
        </div>
      </div>

      {/* Image Comparison Tabs */}
      <div className="glass-card rounded-2xl p-6">
        <Tabs defaultValue="original" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="original">Original</TabsTrigger>
            <TabsTrigger value="ela">ELA Analysis</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          </TabsList>

          <TabsContent value="original" className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-border bg-muted/30">
              <img
                src={originalImageUrl}
                alt="Original image"
                className="w-full h-auto max-h-[400px] object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Original uploaded image
            </p>
          </TabsContent>

          <TabsContent value="ela" className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-border bg-muted/30 relative">
              <img
                src={elaImageUrl}
                alt="ELA analysis"
                className="w-full h-auto max-h-[400px] object-contain"
                style={{ filter: "contrast(1.5) saturate(1.2)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 pointer-events-none" />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Error Level Analysis reveals compression inconsistencies
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(elaImageUrl, "ela-analysis.png")}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-border bg-muted/30 relative">
              <img
                src={heatmapUrl}
                alt="Tampering heatmap"
                className="w-full h-auto max-h-[400px] object-contain"
                style={{ filter: "hue-rotate(180deg) saturate(2)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent pointer-events-none animate-scan" />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Highlighted regions indicate potential tampering
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(heatmapUrl, "heatmap.png")}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button onClick={onReset} variant="outline" size="lg">
          <RotateCcw className="h-4 w-4 mr-2" />
          Analyze Another Image
        </Button>
      </div>
    </div>
  );
};

export default ResultDisplay;
