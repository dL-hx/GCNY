import ajax from '@/utils/request';
import config from '@/utils/config';

const { reqExpect } = config;
const AppId = { AppId: 134 };

export async function getUserList(values) {
  return ajax('/zjapi/getUserList', {...AppId, ...values }, 'GET', reqExpect);
}
