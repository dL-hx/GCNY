import ajax from '@/utils/request';

export async function getSellBuyList(values) {
  return ajax('/api/CMArticle/GetGaoChengGQInfoList', values,'GET');
}

export async function addOrUpdateSellBuy(values) {
  return ajax(`/api/CMArticle${values.aId ? '/Update' : '/Add'}GQ`, values, 'POST');
}
