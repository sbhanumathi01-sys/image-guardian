import { useMemo } from "react";
import { 
  Target, 
  TrendingDown, 
  Crosshair, 
  Undo, 
  Activity,
  Layers
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import MetricCard from "@/components/dashboard/MetricCard";
import AccuracyChart from "@/components/dashboard/AccuracyChart";
import LossChart from "@/components/dashboard/LossChart";
import ConfusionMatrixDisplay from "@/components/dashboard/ConfusionMatrixDisplay";
import { mockModelMetrics } from "@/lib/mockData";

const Dashboard = () => {
  const metrics = useMemo(() => mockModelMetrics, []);

  return (
    <Layout>
      <div className="container py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold">Model Performance Dashboard</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Training metrics and evaluation results for the CNN forgery detection model.
            Trained on CASIA v2.0 and Columbia Image Splicing datasets.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <MetricCard
            title="Final Accuracy"
            value={`${(metrics.finalAccuracy * 100).toFixed(2)}%`}
            subtitle="Validation set"
            icon={Target}
            trend="up"
          />
          <MetricCard
            title="Final Loss"
            value={metrics.finalLoss.toFixed(4)}
            subtitle="Cross-entropy"
            icon={TrendingDown}
            trend="down"
          />
          <MetricCard
            title="Precision"
            value={`${(metrics.precision * 100).toFixed(2)}%`}
            subtitle="True positive rate"
            icon={Crosshair}
            trend="up"
          />
          <MetricCard
            title="Recall"
            value={`${(metrics.recall * 100).toFixed(2)}%`}
            subtitle="Sensitivity"
            icon={Undo}
            trend="up"
          />
        </div>

        {/* Additional Metrics */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <MetricCard
            title="F1 Score"
            value={`${(metrics.f1Score * 100).toFixed(2)}%`}
            subtitle="Harmonic mean of precision and recall"
            icon={Activity}
          />
          <MetricCard
            title="Training Epochs"
            value={metrics.totalEpochs}
            subtitle="With early stopping patience of 10"
            icon={Layers}
          />
        </div>

        {/* Charts Section */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Training History</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <AccuracyChart data={metrics.trainingHistory} />
            <LossChart data={metrics.trainingHistory} />
          </div>
        </div>

        {/* Confusion Matrix Section */}
        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-bold">Classification Results</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <ConfusionMatrixDisplay data={metrics.confusionMatrix} />
            
            {/* Model Info Card */}
            <div className="metric-card space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Model Architecture</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  CNN specifications and training configuration
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Framework</span>
                  <span className="font-mono font-medium">TensorFlow / Keras</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Architecture</span>
                  <span className="font-mono font-medium">Custom CNN</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Input Shape</span>
                  <span className="font-mono font-medium">128 × 128 × 3</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Optimizer</span>
                  <span className="font-mono font-medium">Adam (lr=0.001)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Loss Function</span>
                  <span className="font-mono font-medium">Binary Cross-Entropy</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Batch Size</span>
                  <span className="font-mono font-medium">32</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Dataset Split</span>
                  <span className="font-mono font-medium">80% / 20%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Integration Note */}
        <div className="mt-12 p-6 rounded-xl bg-accent/5 border border-accent/20">
          <h3 className="font-semibold text-accent">Backend Integration</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            This dashboard displays mock data for demonstration. In production, connect to the 
            Flask backend API endpoint <code className="font-mono bg-muted px-1 rounded">/metrics</code> to 
            fetch real training metrics. The metrics are generated during model training and 
            stored for retrieval.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
