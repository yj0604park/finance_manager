import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { ChartDataItem } from '../../types/chart';

const StyledCard = styled(Card)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

export interface ChartCardProps {
  title: string;
  type: 'line' | 'pie';
  data: ChartDataItem[];
  height?: number;
  colors?: string[];
  lineKeys?: string[]; // 라인 차트에서 표시할 데이터 키 배열
  valueKey?: string; // 파이 차트에서 사용할 값 키
  nameKey?: string; // 파이 차트에서 사용할 이름 키
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  type,
  data,
  height = 300,
  colors = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f'],
  lineKeys = ['value'],
  valueKey = 'value',
  nameKey = 'name',
}) => {
  const renderChart = () => {
    if (type === 'line') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {lineKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                name={key}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} dataKey={valueKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={80} label>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" component="div" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ height }}>{renderChart()}</Box>
      </CardContent>
    </StyledCard>
  );
};

export default ChartCard;
