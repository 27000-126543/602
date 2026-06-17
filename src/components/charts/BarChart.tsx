import ReactECharts from 'echarts-for-react';

interface BarChartProps {
  data: {
    categories: string[];
    series: {
      name: string;
      data: number[];
      color?: string;
    }[];
  };
  horizontal?: boolean;
  height?: number;
}

const BarChart = ({ data, horizontal = false, height = 300 }: BarChartProps) => {
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
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
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
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 8,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: horizontal ? {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#94A3B8',
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: '#F1F5F9',
          type: 'dashed',
        },
      },
    } : {
      type: 'category',
      data: data.categories,
      axisLine: {
        lineStyle: { color: '#E2E8F0' },
      },
      axisLabel: {
        color: '#94A3B8',
        fontSize: 12,
        interval: 0,
        rotate: data.categories.length > 6 ? 30 : 0,
      },
      axisTick: { show: false },
    },
    yAxis: horizontal ? {
      type: 'category',
      data: data.categories,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#64748B',
        fontSize: 12,
      },
    } : {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#94A3B8',
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: '#F1F5F9',
          type: 'dashed',
        },
      },
    },
    series: data.series.map((s, index) => {
      const colors = ['#0A2540', '#FF6B35', '#00C9A7', '#8B5CF6', '#F59E0B'];
      const color = s.color || colors[index % colors.length];
      
      return {
        name: s.name,
        type: 'bar',
        barWidth: '50%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: color },
              { offset: 1, color: color + '80' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        data: s.data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: color + '40',
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

export default BarChart;
