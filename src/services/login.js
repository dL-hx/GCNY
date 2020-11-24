import ajax from '@/utils/request';

// 密码登陆
export async function logIn(values) {
  return ajax('/api/Account/Login', values, 'POST');
}

// 退出登录
export async function logOut() {
  return ajax('/api/Account/SignOut', {}, 'POST');
}

// 修改密码 (此处接口使用POST请求在参数上携带字符串 )
export async function updatePwd({ values }) {
  return ajax(`/api/User/SetPwd?oldPassword=${values.OldPassword}&newPassword=${values.NewPassword}`, values, 'POST');
}
