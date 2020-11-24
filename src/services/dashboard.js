import ajax from '@/utils/request';

export async function getChartData() {
  return ajax('/api/Analysis/GETUSERCOUNT', {}, 'GET');
}
