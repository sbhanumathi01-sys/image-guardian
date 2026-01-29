import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { TrainingMetrics } from "@/lib/mockData";

interface LossChartProps {
  data: TrainingMetrics[];
}

const LossChart = ({ data }: LossChartProps) => {
  const chartData = data.map((item) => ({
    epoch: item.epoch,
    "Training Loss": item.trainLoss.toFixed(4),
    "Validation Loss": item.valLoss.toFixed(4),
  }));

  return (
    <div className="metric-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Loss vs Epoch</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Model error reduction during training
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
              domain={[0, "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                boxShadow: "var(--shadow-lg)",
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "1rem" }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="Training Loss"
              stroke="hsl(var(--chart-4))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="Validation Loss"
              stroke="hsl(var(--chart-5))"
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

export default LossChart;
