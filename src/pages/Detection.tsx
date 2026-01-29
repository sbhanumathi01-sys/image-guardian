import { useState } from "react";
import { Info, Shield } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ImageUploader from "@/components/detection/ImageUploader";
import ProcessingState from "@/components/detection/ProcessingState";
import ResultDisplay from "@/components/detection/ResultDisplay";
import { mockPredict, type PredictionResult } from "@/lib/mockData";

type DetectionState = "idle" | "processing" | "complete";
type ProcessingStage = "uploading" | "ela" | "predicting";

const Detection = () => {
  const [state, setState] = useState<DetectionState>("idle");
  const [processingStage, setProcessingStage] = useState<ProcessingStage>("uploading");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleImageSelect = async (file: File, preview: string) => {
    setImagePreview(preview);
    setState("processing");
    
    // Simulate processing stages
    setProcessingStage("uploading");
    await new Promise((r) => setTimeout(r, 500));
    
    setProcessingStage("ela");
    await new Promise((r) => setTimeout(r, 800));
    
    setProcessingStage("predicting");
    
    // Call prediction (mock for now)
    const predictionResult = await mockPredict(file);
    setResult(predictionResult);
    setState("complete");
  };

  const handleReset = () => {
    setState("idle");
    setImagePreview("");
    setResult(null);
    setProcessingStage("uploading");
  };

  return (
    <Layout>
      <div className="container py-12">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Shield className="h-4 w-4" />
            Forgery Detection
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Analyze Image for Tampering
          </h1>
          <p className="mt-3 text-muted-foreground">
            Upload an image to detect potential manipulation using ELA and CNN analysis.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto">
          {state === "idle" && (
            <>
              <ImageUploader onImageSelect={handleImageSelect} />
              
              {/* Info Card */}
              <div className="mt-8 p-6 rounded-xl bg-muted/50 border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Info className="h-5 w-5 text-accent" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">How Detection Works</h3>
                    <p className="text-sm text-muted-foreground">
                      Our system generates an Error Level Analysis (ELA) image to reveal compression 
                      inconsistencies. The ELA is then passed to a CNN trained on CASIA and Columbia 
                      datasets to classify the image as authentic or forged. Results include a 
                      confidence score and tampering heatmap.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {state === "processing" && (
            <ProcessingState stage={processingStage} imagePreview={imagePreview} />
          )}

          {state === "complete" && result && (
            <ResultDisplay result={result} onReset={handleReset} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Detection;
