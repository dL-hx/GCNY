import React from 'react';
export interface ISimpleTimelineChartProps {
  data: Array<{
    x: string;  // 日期字符串 如：2020-02-13
    y: number;
  }>;
  title: string; // y轴及卡片的标题
  height?: number;
}

export default class SimpleTimelineChart extends React.Component<ISimpleTimelineChartProps, any> {}
// Api: https://bizcharts.net/products/bizCharts/api/bizcharts
