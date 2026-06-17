import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { getProvinceData } from '@/data/mock/provinces';

interface ChinaHeatMapProps {
  onProvinceClick?: (provinceName: string) => void;
  selectedProvince?: string | null;
}

const ChinaHeatMap = ({ onProvinceClick, selectedProvince }: ChinaHeatMapProps) => {
  const provinceData = useMemo(() => getProvinceData(), []);

  const option = useMemo(() => {
    const maxValue = Math.max(...provinceData.map(p => p.value));
    
    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: [12, 16],
        textStyle: {
          color: '#334155',
          fontSize: 13,
        },
        formatter: (params: any) => {
          const data = provinceData.find(p => p.name === params.name);
          if (!data) return params.name;
          return `
            <div style="font-weight: 600; margin-bottom: 8px; color: #0F172A;">${params.name}</div>
            <div style="display: flex; justify-content: space-between; gap: 24px; margin-bottom: 4px;">
              <span style="color: #64748B;">展会数量</span>
              <span style="font-weight: 600;">${data.exhibitionCount}场</span>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 24px; margin-bottom: 4px;">
              <span style="color: #64748B;">展馆数量</span>
              <span style="font-weight: 600;">${data.venueCount}个</span>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 24px;">
              <span style="color: #64748B;">满意度</span>
              <span style="font-weight: 600; color: #00C9A7;">${data.avgSatisfaction}分</span>
            </div>
          `;
        },
      },
      visualMap: {
        min: 0,
        max: maxValue,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'],
        textStyle: {
          color: '#64748B',
          fontSize: 12,
        },
        inRange: {
          color: ['#E0F2FE', '#7DD3FC', '#38BDF8', '#0EA5E9', '#0284C7', '#0A2540'],
        },
        calculable: true,
      },
      geo: {
        map: 'china',
        roam: false,
        zoom: 1.2,
        label: {
          show: false,
        },
        itemStyle: {
          areaColor: '#F1F5F9',
          borderColor: '#CBD5E1',
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: {
            areaColor: '#FF6B35',
            shadowColor: 'rgba(255, 107, 53, 0.3)',
            shadowBlur: 20,
          },
          label: {
            show: true,
            color: '#fff',
            fontWeight: 600,
          },
        },
        select: {
          itemStyle: {
            areaColor: '#0A2540',
          },
          label: {
            show: true,
            color: '#fff',
          },
        },
      },
      series: [
        {
          name: '展会数量',
          type: 'map',
          geoIndex: 0,
          data: provinceData.map(p => ({
            name: p.name,
            value: p.value,
          })),
        },
      ],
    };
  }, [provinceData]);

  const handleClick = (params: any) => {
    if (onProvinceClick && params.name) {
      onProvinceClick(params.name);
    }
  };

  const chartRef = (e: any) => {
    if (e && e.getEchartsInstance) {
      const chart = e.getEchartsInstance();
      chart.on('click', handleClick);
    }
  };

  return (
    <div className="w-full h-full">
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'canvas' }}
        lazyUpdate
      />
    </div>
  );
};

export default ChinaHeatMap;
