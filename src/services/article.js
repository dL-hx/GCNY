import ajax from '@/utils/request';

export async function getArticleList(values) {
  return ajax('/api/CMArticle/GetGaoChengCMArticleInfoList', values, 'GET');
}

export async function addOrUpdateArticle(values) {
  return ajax(`/api/CMArticle${values.aId ? '/Update' : '/Add'}`, values, 'POST');
}

export async function changeArticleStatus(values) {
  return ajax(`/api/CMArticle/Audit?aid=${values.aId}&status=${values.status}`, values, 'POST');
}

export async function removeArticleById(values) {
  return ajax(`/api/CMArticle/Delete?aid=${values.aId}`, {}, 'POST');
}
