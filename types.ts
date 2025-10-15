export interface ChartData {
  name: string;
  value: number;
}

export interface DonutChartData extends ChartData {
  color: string;
}
