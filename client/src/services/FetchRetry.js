const getCsrfCookies = () => {
  let cookieArr = document.cookie.split(';');
  let cookieObj = {};
  if (cookieArr.length > 1) {
    cookieArr.forEach(cookie => {
      let cookiePair = cookie.split('=');
      cookieObj[cookiePair[0].trim()] = cookiePair[1].trim();
    });
  }
  return cookieObj;
};
let cookies = getCsrfCookies();

export const fetchRetry = async (url, {
  method = 'GET',
  credentials = 'include',
  headers = {
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN-ACCESS': cookies['csrf_access_token'],
  },
}, tries = 2) => {
  let error;
  for (let i = 0; i < tries; i++) {
    const response = await fetch(url, {method, credentials, headers});
    if (!response.ok) {
      error = response['msg'];
      await fetch('/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN-REFRESH': cookies['csrf_refresh_token'],
        },
      });
    } else return response;
  }
  throw Error(error);
};
