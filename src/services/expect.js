import ajax from '@/utils/request';
import config from '@/utils/config';

const { reqExpect } = config;
const AppId = { AppId: 134 };

export async function getExpectListOrSearch(values) {
  return ajax(values.likeField?'/zjapi/SearchExeprt':'/zjapi/getExeprtList', {...AppId, ...values }, 'GET', reqExpect);
}


export async function addOrUpdateExpect(values) {
  // console.log('values', values);
  return ajax(`/zjapi${values.userid ? '/upd' : '/insert'}`, {...AppId, ...values }, 'POST', reqExpect);
}

export async function removeExpectById(values) {
  return ajax('/zjapi/del', values, 'GET', reqExpect);
}

/*export async function changeEnteriseStatus(values) {
  return ajax('/api/Enterprise/ChangeStatus', values, 'GET', reqExpect);
}*/


/*
export async function changeNewsStatus(values) {
  return ajax('/zxapi/NewsIsPublish', { ...AppId, ...values }, 'GET', reqExpect);
}

export async function removeNewsById(values) {
  return ajax('/zxapi/del', values, 'GET',reqExpect);
}
*/
