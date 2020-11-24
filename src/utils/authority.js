const globalStore = window.localStorage;

export function setItem(key, value) {
  globalStore.setItem(key, value);
}

export function getItem(key) {
  return globalStore.getItem(key);
}

export function removeItem(key) {
  globalStore.removeItem(key);
}

export function clearAllKeys() {
  globalStore.clear();
}

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('role') || ['admin', 'user'];
  const authorityString = typeof str === 'undefined' ? getItem('role') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }

  return authority;
}

export const setAuthority = authority => {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  setItem('role', JSON.stringify(proAuthority));
};


export function getRole() {
  const str = getItem('role');
  const role = str === null ? ['guest'] : JSON.parse(str)[0];
  return role;
}

function setItems(obj) {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    setItem(key, value);
  });
}

export function setUserInfo(name, userId) {
  setItems({
    'userName': name,
    'userId': userId,
  });
}

export function getUserId() {
  return getItem('userId');
}

export function getUserName() {
  return getItem('userName');
}

export function isAdmin() { // use isAdmin function judged role whether is  'admin'
  const role = getRole();

  return role === 'admin';
}
