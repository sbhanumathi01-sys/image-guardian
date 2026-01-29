// Mock data for demonstration - Replace with real API calls to Flask backend

export interface TrainingMetrics {
  epoch: number;
  trainAccuracy: number;
  valAccuracy: number;
  trainLoss: number;
  valLoss: number;
}

export interface ConfusionMatrix {
  truePositive: number;
  falsePositive: number;
  trueNegative: number;
  falseNegative: number;
}

export interface ModelMetrics {
  finalAccuracy: number;
  finalLoss: number;
  precision: number;
  recall: number;
  f1Score: number;
  totalEpochs: number;
  trainingHistory: TrainingMetrics[];
  confusionMatrix: ConfusionMatrix;
}

export interface PredictionResult {
  isForged: boolean;
  confidence: number;
  elaImageUrl: string;
  heatmapUrl: string;
  originalImageUrl: string;
  processingTime: number;
}

// Simulated training history (50 epochs)
export const generateTrainingHistory = (): TrainingMetrics[] => {
  const history: TrainingMetrics[] = [];
  
  for (let epoch = 1; epoch <= 50; epoch++) {
    const progress = epoch / 50;
    const noise = () => (Math.random() - 0.5) * 0.05;
    
    // Simulate learning curve
    const trainAcc = Math.min(0.99, 0.5 + 0.45 * (1 - Math.exp(-3 * progress)) + noise());
    const valAcc = Math.min(0.98, 0.48 + 0.42 * (1 - Math.exp(-2.5 * progress)) + noise());
    const trainLoss = Math.max(0.05, 0.8 * Math.exp(-3 * progress) + noise() * 0.1);
    const valLoss = Math.max(0.08, 0.85 * Math.exp(-2.5 * progress) + noise() * 0.15);
    
    history.push({
      epoch,
      trainAccuracy: Number(trainAcc.toFixed(4)),
      valAccuracy: Number(valAcc.toFixed(4)),
      trainLoss: Number(trainLoss.toFixed(4)),
      valLoss: Number(valLoss.toFixed(4)),
    });
  }
  
  return history;
};

export const mockModelMetrics: ModelMetrics = {
  finalAccuracy: 0.9647,
  finalLoss: 0.0823,
  precision: 0.9512,
  recall: 0.9734,
  f1Score: 0.9622,
  totalEpochs: 50,
  trainingHistory: generateTrainingHistory(),
  confusionMatrix: {
    truePositive: 487,
    falsePositive: 24,
    trueNegative: 476,
    falseNegative: 13,
  },
};

// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// API endpoints
export const API_ENDPOINTS = {
  upload: `${API_BASE_URL}/upload`,
  generateEla: `${API_BASE_URL}/generate-ela`,
  predict: `${API_BASE_URL}/predict`,
  metrics: `${API_BASE_URL}/metrics`,
};

// Helper function to simulate API delay
export const simulateApiCall = <T>(data: T, delay = 1500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Mock prediction function
export const mockPredict = async (imageFile: File): Promise<PredictionResult> => {
  // Simulate processing time
  const processingTime = 1200 + Math.random() * 800;
  
  await new Promise((resolve) => setTimeout(resolve, processingTime));
  
  // Random result for demo
  const isForged = Math.random() > 0.5;
  const confidence = isForged 
    ? 0.7 + Math.random() * 0.28 
    : 0.75 + Math.random() * 0.24;
  
  return {
    isForged,
    confidence: Number(confidence.toFixed(4)),
    elaImageUrl: URL.createObjectURL(imageFile), // In real app, this comes from backend
    heatmapUrl: URL.createObjectURL(imageFile), // In real app, this comes from backend
    originalImageUrl: URL.createObjectURL(imageFile),
    processingTime: Number((processingTime / 1000).toFixed(2)),
  };
};
