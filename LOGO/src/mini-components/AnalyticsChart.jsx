import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { Box, Text } from "@chakra-ui/react";

export default function AnalyticsChart({ data, ...props }) {
  if (!data || data.length === 0) {
    data = [
      { month: "Jan", removed: 5000, sent: 6000, rejected: 1000 },
      { month: "Feb", removed: 4800, sent: 5000, rejected: 950 },
      { month: "Mar", removed: 4700, sent: 5500, rejected: 900 },
      { month: "Apr", removed: 3600, sent: 4400, rejected: 800 },
      { month: "May", removed: 3900, sent: 4700, rejected: 600 },
      { month: "Jun", removed: 5100, sent: 5800, rejected: 650 },
      { month: "Jul", removed: 5400, sent: 5900, rejected: 850 },
      { month: "Aug", removed: 5700, sent: 6000, rejected: 720 },
      { month: "Sep", removed: 5300, sent: 5600, rejected: 500 },
      { month: "Oct", removed: 4700, sent: 5000, rejected: 400 },
      { month: "Nov", removed: 4600, sent: 4900, rejected: 420 },
      { month: "Dec", removed: 4500, sent: 4800, rejected: 430 },
    ];
  }
  return (
    <Box {...props}>
      <ResponsiveContainer width="100%">
        <BarChart data={data} barGap={4} margin={{ top: 0 }}>
          <CartesianGrid
            strokeDasharray="9 7"
            horizontal={true}
            vertical={false}
            stroke="#F1F1F1"
            strokeWidth={1.5}
          />
          <XAxis
            dataKey="month"
            axisLine={{ stroke: "#F1F1F1" }}
            tickLine={{ stroke: "#transparat" }}
          />
          <YAxis
            ticks={[0, 1000, 2000, 3000, 4000, 5000, 6000]}
            interval={0} // <- Forceer alle ticks
            tickFormatter={(value) => `${value.toLocaleString()}`}
            axisLine={{ stroke: "transparat" }}
            tickLine={{ stroke: "transparat" }}
            padding={{ top: 15, bottom: 0 }} // <- padding voor de y-as
          />
          <Bar
            dataKey="removed"
            fill="#D7F0FC"
            name="Listings Removed"
            barSize={6}
          />
          <Bar dataKey="sent" fill="#CDEFD9" name="Notices Sent" barSize={6} />
          <Bar
            dataKey="rejected"
            fill="#FEA4A3"
            name="Notices Rejected"
            barSize={6}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
