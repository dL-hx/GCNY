import ajax from '@/utils/request';

export async function getAccountList(values) {
  return ajax(`/api/Base_User/Get`, values, 'GET');
}

export async function addOrUpdateAccount(values) {
  return ajax(`/api/Base_User${values.userId ? '/Update' : '/add'}`, values, 'POST');
}

export async function removeAccountById(values) {
  return ajax(`/api/Base_User/Delete?UserID=${values.UserID}`, values, 'POST');
}

export async function resetAccountPwdById(values) {
  return ajax(`/api/Base_User/ResetPassword?UserID=${values.UserID}`, values, 'POST');
}

