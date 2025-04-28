import { AreaChart, Area, ResponsiveContainer } from "recharts";

export default function ChartLine({ data, ...props }) {
  if (!data || data.length === 0) {
    data = [
      { value: 120 },
      { value: 130 },
      { value: 150 },
      { value: 200 },
      { value: 320 },
      { value: 310 },
      { value: 330 },
      { value: 340 },
      { value: 360 },
      { value: 350 },
    ];
  }

  return (
    <ResponsiveContainer width="100%" height="100%" {...props}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E4F5D1" />
            <stop offset="100%" stopColor="#E4F5D1" />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke="#85BA49"
          strokeWidth={3}
          fill="url(#colorFill)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
