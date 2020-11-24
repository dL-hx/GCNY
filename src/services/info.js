import ajax from '@/utils/request';
import config, { AppId } from '@/utils/config';

const { reqNews } = config;

export async function getNewsOrSearch(values) {
  return ajax(`/zxapi${values.likeField ? '/SearchNewsList1' : '/getNewsByType1'}`, { ...AppId, ...values }, 'GET', reqNews);
}

export async function changeAuditForNews(values) {
  return ajax('/zxapi/NewsIsPublish', { ...AppId, ...values }, 'GET', reqNews);
}

// export async function addOrUpdateNews(values) {
//   return ajax(`/zjapi${values.articleid ? '/ZmtUpdate' : '/ZmtAddNews'}`, { ...AppId, ...values }, 'POST', reqNews);
// }

export async function removeNewsById(values) {
  return ajax('/zxapi/del', values, 'GET', reqNews);
}
