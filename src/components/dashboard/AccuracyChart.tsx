import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { TrainingMetrics } from "@/lib/mockData";

interface AccuracyChartProps {
  data: TrainingMetrics[];
}

const AccuracyChart = ({ data }: AccuracyChartProps) => {
  const chartData = data.map((item) => ({
    epoch: item.epoch,
    "Training Accuracy": (item.trainAccuracy * 100).toFixed(2),
    "Validation Accuracy": (item.valAccuracy * 100).toFixed(2),
  }));

  return (
    <div className="metric-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Accuracy vs Epoch</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Model learning performance over training epochs
        </p>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="epoch"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              label={{ value: "Epoch", position: "insideBottom", offset: -5, fontSize: 12 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              domain={[40, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                boxShadow: "var(--shadow-lg)",
              }}
              formatter={(value: string) => [`${value}%`, ""]}
            />
            <Legend
              wrapperStyle={{ paddingTop: "1rem" }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="Training Accuracy"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="Validation Accuracy"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AccuracyChart;
