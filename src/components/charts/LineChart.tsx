import ReactECharts from 'echarts-for-react';

interface LineChartProps {
  data: {
    dates: string[];
    series: {
      name: string;
      data: number[];
      color?: string;
      areaStyle?: boolean;
    }[];
  };
  height?: number;
  smooth?: boolean;
}

const LineChart = ({ data, height = 300, smooth = true }: LineChartProps) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E2E8F0',
      borderWidth: 1,
      padding: [12, 16],
      textStyle: {
        color: '#334155',
        fontSize: 13,
      },
    },
    legend: {
      data: data.series.map(s => s.name),
      right: 0,
      top: 0,
      textStyle: {
        color: '#64748B',
        fontSize: 12,
      },
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.dates,
      axisLine: {
        lineStyle: {
          color: '#E2E8F0',
        },
      },
      axisLabel: {
        color: '#94A3B8',
        fontSize: 12,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#94A3B8',
        fontSize: 12,
        formatter: (value: number) => {
          if (value >= 10000) return (value / 10000).toFixed(0) + '万';
          return value.toString();
        },
      },
      splitLine: {
        lineStyle: {
          color: '#F1F5F9',
          type: 'dashed',
        },
      },
    },
    series: data.series.map((s, index) => {
      const colors = ['#0A2540', '#FF6B35', '#00C9A7', '#8B5CF6'];
      const color = s.color || colors[index % colors.length];
      
      return {
        name: s.name,
        type: 'line',
        smooth: smooth,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        lineStyle: {
          width: 3,
          color: color,
        },
        itemStyle: {
          color: color,
          borderWidth: 2,
          borderColor: '#fff',
        },
        areaStyle: s.areaStyle ? {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: color + '30' },
              { offset: 1, color: color + '05' },
            ],
          },
        } : undefined,
        data: s.data,
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 10,
            shadowColor: color + '50',
          },
        },
      };
    }),
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: `${height}px`, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default LineChart;
