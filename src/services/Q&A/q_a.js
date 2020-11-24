import ajax from '@/utils/request';
import config, { AppId } from '@/utils/config';

export const QA_ASK_SERVER_CONFIG = {
  fetch: 'get_all_ask_list',
  search: 'search_all_ask_list',
};

const { reqNews } = config;

export async function getQAList(values) {

  const { pageNow, type, id, ...rest } = values;

  const data = {
    page: pageNow,
    ...rest,
  };

  if (type === QA_ASK_SERVER_CONFIG.fetch) {
    data.id = id;
  }

  return ajax(`/askapi/query`, {
      type,
      data,
    },
    'POST',
    reqNews);
}


export async function removeQAById(values) {
  return ajax('/askapi/DelAsk', values, 'GET', reqNews);
}


export async function changeAuditForQA(values) {
  return ajax('/askapi/AskIsPublish', { ...AppId, ...values }, 'GET', reqNews);
}
